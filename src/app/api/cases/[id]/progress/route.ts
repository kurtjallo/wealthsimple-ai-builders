import { NextRequest } from 'next/server';
import { getProgressEmitter } from '@/lib/pipeline/progress-emitter';

/**
 * Server-Sent Events endpoint for real-time pipeline progress.
 * The client connects with EventSource and receives events as agents complete.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: caseId } = await params;

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      const emitter = getProgressEmitter(caseId);

      // Send initial connection event
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: 'connected', case_id: caseId })}\n\n`)
      );

      if (!emitter) {
        // No active pipeline — send status and close
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'no_pipeline', case_id: caseId, message: 'No active processing pipeline' })}\n\n`)
        );
        controller.close();
        return;
      }

      // Send all existing events (catch up)
      for (const event of emitter.getEvents()) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'progress', ...event })}\n\n`)
        );
      }

      // Subscribe to new events
      const unsubscribe = emitter.on((event) => {
        try {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: 'progress', ...event })}\n\n`)
          );

          // Close stream when pipeline completes or fails
          if (event.status === 'completed' && (event.stage === 'completed' || event.stage === 'failed')) {
            setTimeout(() => {
              try {
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ type: 'done', case_id: caseId })}\n\n`)
                );
                controller.close();
              } catch {
                // Stream may already be closed
              }
            }, 500);
          }
        } catch {
          // Client disconnected
          unsubscribe();
        }
      });

      // Clean up on client disconnect
      request.signal.addEventListener('abort', () => {
        unsubscribe();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
