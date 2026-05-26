import { normalizeMcpToolAction, resolveMcpToolSource } from '../normalizeMcpToolAction';

describe('normalizeMcpToolAction', () => {
  it.each([
    ['list_article', 'list'],
    ['get_product', 'get'],
    ['create_article', 'create'],
    ['update_article', 'update'],
    ['delete_article', 'delete'],
    ['publish_article', 'publish'],
    ['unpublish_article', 'unpublish'],
    ['discard_article_draft', 'discard_draft'],
    ['write_homepage', 'write'],
    ['log', 'log'],
  ] as const)('maps %s to %s', (toolName, action) => {
    expect(normalizeMcpToolAction(toolName)).toBe(action);
  });

  it('returns null for unknown tool names', () => {
    expect(normalizeMcpToolAction('custom_plugin_tool')).toBeNull();
  });
});

describe('resolveMcpToolSource', () => {
  it('treats the core log tool as core', () => {
    expect(resolveMcpToolSource('log')).toBe('core');
  });

  it('treats derived content tools as content-manager', () => {
    expect(resolveMcpToolSource('create_article')).toBe('content-manager');
  });
});
