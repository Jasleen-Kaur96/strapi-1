import { normalizeMcpCapability } from '../normalizeMcpCapability';

describe('normalizeMcpCapability', () => {
  it('returns raw capability identity for tools', () => {
    expect(normalizeMcpCapability('tool', 'create_article')).toEqual({
      type: 'tool',
      name: 'create_article',
    });
  });

  it('returns raw capability identity for custom tools', () => {
    expect(normalizeMcpCapability('tool', 'custom_plugin_tool')).toEqual({
      type: 'tool',
      name: 'custom_plugin_tool',
    });
  });

  it('tracks prompts and resources as raw identities', () => {
    expect(normalizeMcpCapability('prompt', 'summarize_entry')).toEqual({
      type: 'prompt',
      name: 'summarize_entry',
    });
    expect(normalizeMcpCapability('resource', 'project://readme')).toEqual({
      type: 'resource',
      name: 'project://readme',
    });
  });
});
