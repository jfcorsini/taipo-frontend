// eslint-disable
// this is an auto generated file. This will be overwritten

export const createChat = `mutation CreateChat($input: CreateChatInput!) {
  createChat(input: $input) {
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
export const updateChat = `mutation UpdateChat($input: UpdateChatInput!) {
  updateChat(input: $input) {
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
export const deleteChat = `mutation DeleteChat($input: DeleteChatInput!) {
  deleteChat(input: $input) {
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
export const createMessage = `mutation CreateMessage($input: CreateMessageInput!) {
  createMessage(input: $input) {
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
export const updateMessage = `mutation UpdateMessage($input: UpdateMessageInput!) {
  updateMessage(input: $input) {
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
export const deleteMessage = `mutation DeleteMessage($input: DeleteMessageInput!) {
  deleteMessage(input: $input) {
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
export const createUser = `mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
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
export const updateUser = `mutation UpdateUser($input: UpdateUserInput!) {
  updateUser(input: $input) {
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
export const deleteUser = `mutation DeleteUser($input: DeleteUserInput!) {
  deleteUser(input: $input) {
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
