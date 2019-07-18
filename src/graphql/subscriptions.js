// eslint-disable
// this is an auto generated file. This will be overwritten

export const onCreateChat = `subscription OnCreateChat {
  onCreateChat {
    id
    name
    messages {
      items {
        id
        text
      }
      nextToken
    }
  }
}
`;
export const onUpdateChat = `subscription OnUpdateChat {
  onUpdateChat {
    id
    name
    messages {
      items {
        id
        text
      }
      nextToken
    }
  }
}
`;
export const onDeleteChat = `subscription OnDeleteChat {
  onDeleteChat {
    id
    name
    messages {
      items {
        id
        text
      }
      nextToken
    }
  }
}
`;
export const onCreateMessage = `subscription OnCreateMessage {
  onCreateMessage {
    id
    text
    chat {
      id
      name
      messages {
        nextToken
      }
    }
    user {
      id
      name
      messages {
        nextToken
      }
    }
  }
}
`;
export const onUpdateMessage = `subscription OnUpdateMessage {
  onUpdateMessage {
    id
    text
    chat {
      id
      name
      messages {
        nextToken
      }
    }
    user {
      id
      name
      messages {
        nextToken
      }
    }
  }
}
`;
export const onDeleteMessage = `subscription OnDeleteMessage {
  onDeleteMessage {
    id
    text
    chat {
      id
      name
      messages {
        nextToken
      }
    }
    user {
      id
      name
      messages {
        nextToken
      }
    }
  }
}
`;
export const onCreateUser = `subscription OnCreateUser {
  onCreateUser {
    id
    name
    messages {
      items {
        id
        text
      }
      nextToken
    }
  }
}
`;
export const onUpdateUser = `subscription OnUpdateUser {
  onUpdateUser {
    id
    name
    messages {
      items {
        id
        text
      }
      nextToken
    }
  }
}
`;
export const onDeleteUser = `subscription OnDeleteUser {
  onDeleteUser {
    id
    name
    messages {
      items {
        id
        text
      }
      nextToken
    }
  }
}
`;
