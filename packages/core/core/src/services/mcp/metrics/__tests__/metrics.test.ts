import {
  classifyMcpRequestFailure,
  resetMcpMetricsStateForTests,
  sendDidExecuteMcpCapability,
  sendDidNotAuthenticateMcpRequest,
  sendDidNotExecuteMcpCapability,
  sendDidNotHandleMcpRequest,
  sendDidStartMcpServer,
  sendDidUseMcpServer,
} from '../metrics';

describe('MCP metrics', () => {
  beforeEach(() => {
    resetMcpMetricsStateForTests();
  });

  test('sendDidStartMcpServer sends path and capability counts', () => {
    const send = jest.fn().mockReturnValue(Promise.resolve(true));
    const strapi = { telemetry: { send } } as any;

    sendDidStartMcpServer(strapi, {
      path: '/mcp',
      numberOfTools: 12,
      numberOfPrompts: 1,
      numberOfResources: 0,
    });

    expect(send).toHaveBeenCalledWith('didStartMcpServer', {
      eventProperties: { path: '/mcp' },
      groupProperties: {
        numberOfTools: 12,
        numberOfPrompts: 1,
        numberOfResources: 0,
      },
    });
  });

  test('sendDidUseMcpServer sends a rate-limited adoption event', () => {
    const send = jest.fn().mockReturnValue(Promise.resolve(true));
    const strapi = { telemetry: { send } } as any;

    sendDidUseMcpServer(strapi);

    expect(send).toHaveBeenCalledWith('didUseMcpServer');
  });

  test('sendDidNotAuthenticateMcpRequest sends errorClass without token details', () => {
    const send = jest.fn().mockReturnValue(Promise.resolve(true));
    const strapi = { telemetry: { send } } as any;

    sendDidNotAuthenticateMcpRequest(strapi, 'missing_token');

    expect(send).toHaveBeenCalledWith('didNotAuthenticateMcpRequest', {
      eventProperties: { errorClass: 'missing_token' },
    });
  });

  test('sendDidNotHandleMcpRequest sends errorClass without error messages', () => {
    const send = jest.fn().mockReturnValue(Promise.resolve(true));
    const strapi = { telemetry: { send } } as any;

    sendDidNotHandleMcpRequest(strapi, 'timeout');

    expect(send).toHaveBeenCalledWith('didNotHandleMcpRequest', {
      eventProperties: { errorClass: 'timeout' },
    });
  });

  test('classifyMcpRequestFailure distinguishes timeouts from other errors', () => {
    expect(
      classifyMcpRequestFailure(
        new Error("Operation 'transport.handleRequest' timed out after 1ms")
      )
    ).toBe('timeout');
    expect(classifyMcpRequestFailure(new Error('Connect failed'))).toBe('error');
    expect(classifyMcpRequestFailure('failure')).toBe('error');
  });

  test('sendDidExecuteMcpCapability sends type, action, and source without capability names', () => {
    const send = jest.fn().mockReturnValue(Promise.resolve(true));
    const strapi = { telemetry: { send } } as any;

    sendDidExecuteMcpCapability(strapi, {
      type: 'tool',
      action: 'create',
      source: 'content-manager',
    });

    expect(send).toHaveBeenCalledWith('didExecuteMcpCapability', {
      eventProperties: { type: 'tool', action: 'create', source: 'content-manager' },
    });
  });

  test('sendDidNotExecuteMcpCapability sends errorClass without capability names', () => {
    const send = jest.fn().mockReturnValue(Promise.resolve(true));
    const strapi = { telemetry: { send } } as any;

    sendDidNotExecuteMcpCapability(
      strapi,
      { type: 'tool', action: 'create', source: 'content-manager' },
      'execution_error'
    );

    expect(send).toHaveBeenCalledWith('didNotExecuteMcpCapability', {
      eventProperties: {
        type: 'tool',
        action: 'create',
        source: 'content-manager',
        errorClass: 'execution_error',
      },
    });
  });

  test('sendDidExecuteMcpCapability rate-limits per capability identity within 24h', () => {
    const send = jest.fn().mockReturnValue(Promise.resolve(true));
    const strapi = { telemetry: { send } } as any;
    const identity = {
      type: 'tool' as const,
      action: 'create' as const,
      source: 'content-manager' as const,
    };

    sendDidExecuteMcpCapability(strapi, identity);
    sendDidExecuteMcpCapability(strapi, identity);
    sendDidExecuteMcpCapability(strapi, { ...identity, action: 'update' });

    expect(send).toHaveBeenCalledTimes(2);
  });

  test('success and failure capability metrics are deduped independently', () => {
    const send = jest.fn().mockReturnValue(Promise.resolve(true));
    const strapi = { telemetry: { send } } as any;
    const identity = {
      type: 'tool' as const,
      action: 'create' as const,
      source: 'content-manager' as const,
    };

    sendDidExecuteMcpCapability(strapi, identity);
    sendDidNotExecuteMcpCapability(strapi, identity, 'execution_error');
    sendDidExecuteMcpCapability(strapi, identity);
    sendDidNotExecuteMcpCapability(strapi, identity, 'execution_error');

    expect(send).toHaveBeenCalledTimes(2);
  });
});
