// amplify/data/schema.ts
import { defineData } from '@aws-amplify/backend';

const schema = {
  Calendar: {
    attributes: {
      id: {
        type: 'string',
        required: true,
        primaryKey: true,
      },
      title: {
        type: 'string',
        required: true,
      },
      type: {
        type: 'string',
        required: true,
      },
      year: {
        type: 'number',
        required: true,
      },
      theme: {
        type: 'json',
        required: true,
      },
      settings: {
        type: 'json',
        required: true,
      },
      events: {
        type: 'json',
        required: false,
      },
      owner: {
        type: 'string',
        required: true,
      },
      createdAt: {
        type: 'timestamp',
        isCreatedAt: true,
      },
      updatedAt: {
        type: 'timestamp',
        isUpdatedAt: true,
      }
    },
    authorizations: {
      'owner-auth': {
        strategy: 'owner',
        ownerField: 'owner',
        identityClaim: 'sub',
        operations: ['create', 'update', 'delete', 'read'],
        groupClaim: 'cognito:groups',
      }
    }
  },
  Event: {
    attributes: {
      id: {
        type: 'string',
        required: true,
        primaryKey: true,
      },
      calendarId: {
        type: 'string',
        required: true,
        index: true,
      },
      title: {
        type: 'string',
        required: true,
      },
      date: {
        type: 'timestamp',
        required: true,
      },
      color: {
        type: 'string',
        required: false,
      },
      description: {
        type: 'string',
        required: false,
      },
      owner: {
        type: 'string',
        required: true,
      }
    },
    authorizations: {
      'owner-auth': {
        strategy: 'owner',
        ownerField: 'owner',
        identityClaim: 'sub',
        operations: ['create', 'update', 'delete', 'read'],
        groupClaim: 'cognito:groups',
      }
    }
  },
  Theme: {
    attributes: {
      id: {
        type: 'string',
        required: true,
        primaryKey: true,
      },
      name: {
        type: 'string',
        required: true,
      },
      category: {
        type: 'string',
        required: true,
      },
      colors: {
        type: 'json',
        required: true,
      },
      frame: {
        type: 'json',
        required: true,
      },
      typography: {
        type: 'json',
        required: true,
      },
      owner: {
        type: 'string',
        required: true,
      }
    },
    authorizations: {
      'owner-auth': {
        strategy: 'owner',
        ownerField: 'owner',
        identityClaim: 'sub',
        operations: ['create', 'update', 'delete', 'read'],
        groupClaim: 'cognito:groups',
      }
    }
  }
} as const;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
    // Add API key if needed for public access
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    }
  }
});

export type Schema = typeof schema;