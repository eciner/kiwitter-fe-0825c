export function isPostOwner(currentUser, post) {
  if (!currentUser || !post) {
    return false;
  }

  if (currentUser.sub != null && post.authorId != null) {
    return String(currentUser.sub) === String(post.authorId);
  }

  if (currentUser.nickname && post.username) {
    return currentUser.nickname === post.username;
  }

  return false;
}
