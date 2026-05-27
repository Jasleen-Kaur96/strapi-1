export type McpCapabilityType = 'tool' | 'prompt' | 'resource';

export type McpCapabilityIdentity = {
  type: McpCapabilityType;
  name: string;
};

export const normalizeMcpCapability = (
  type: McpCapabilityType,
  name: string
): McpCapabilityIdentity => ({ type, name });
