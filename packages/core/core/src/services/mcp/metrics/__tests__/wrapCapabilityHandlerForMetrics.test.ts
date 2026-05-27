import { sendDidExecuteMcpCapability, sendDidNotExecuteMcpCapability } from '../metrics';
import { wrapCapabilityHandlerForMetrics } from '../wrapCapabilityHandlerForMetrics';

jest.mock('../metrics', () => ({
  sendDidExecuteMcpCapability: jest.fn(),
  sendDidNotExecuteMcpCapability: jest.fn(),
}));

describe('wrapCapabilityHandlerForMetrics', () => {
  beforeEach(() => {
    jest.mocked(sendDidExecuteMcpCapability).mockClear();
    jest.mocked(sendDidNotExecuteMcpCapability).mockClear();
  });

  test('records metrics after a successful tool call', async () => {
    const strapi = { telemetry: { send: jest.fn() } } as any;
    const handler = jest.fn().mockResolvedValue({ content: [{ type: 'text', text: 'ok' }] });

    const wrapped = wrapCapabilityHandlerForMetrics(strapi, 'tool', 'create_article', handler);
    await wrapped({ args: {} });

    expect(sendDidExecuteMcpCapability).toHaveBeenCalledWith(strapi, {
      type: 'tool',
      name: 'create_article',
    });
    expect(sendDidNotExecuteMcpCapability).not.toHaveBeenCalled();
  });

  test('records failure metrics when the handler returns an error result', async () => {
    const strapi = { telemetry: { send: jest.fn() } } as any;
    const handler = jest.fn().mockResolvedValue({
      content: [{ type: 'text', text: 'failed' }],
      isError: true,
    });

    const wrapped = wrapCapabilityHandlerForMetrics(strapi, 'tool', 'create_article', handler);
    await wrapped({ args: {} });

    expect(sendDidNotExecuteMcpCapability).toHaveBeenCalledWith(
      strapi,
      { type: 'tool', name: 'create_article' },
      'execution_error'
    );
    expect(sendDidExecuteMcpCapability).not.toHaveBeenCalled();
  });

  test('records metrics for unknown capability names', async () => {
    const strapi = { telemetry: { send: jest.fn() } } as any;
    const handler = jest.fn().mockResolvedValue({ content: [{ type: 'text', text: 'ok' }] });

    const wrapped = wrapCapabilityHandlerForMetrics(strapi, 'tool', 'unknown_tool', handler);
    await wrapped({ args: {} });

    expect(sendDidExecuteMcpCapability).toHaveBeenCalledWith(strapi, {
      type: 'tool',
      name: 'unknown_tool',
    });
    expect(sendDidNotExecuteMcpCapability).not.toHaveBeenCalled();
  });
});
