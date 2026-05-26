import { normalizeMcpCapability } from '../normalizeMcpCapability';

describe('normalizeMcpCapability', () => {
  it('maps tool names to coarse actions', () => {
    expect(normalizeMcpCapability('tool', 'create_article')).toEqual({
      type: 'tool',
      action: 'create',
      source: 'content-manager',
    });
  });

  it('returns null for unknown tool names', () => {
    expect(normalizeMcpCapability('tool', 'custom_plugin_tool')).toBeNull();
  });

  it('returns null for prompts and resources until normalization rules exist', () => {
    expect(normalizeMcpCapability('prompt', 'summarize_entry')).toBeNull();
    expect(normalizeMcpCapability('resource', 'project://readme')).toBeNull();
  });
});
