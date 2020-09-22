export const initialState = {
  posts: [],
  user: {},
};

const reducer = (state, action) => {    

  switch (action.type) {
    case "INIT_WALL":
      return { ...state, posts: action.posts };
      case "ADD_POST":
        return { ...state, posts: [action.post, ...state.posts, ] };
      case "DELETE_POST":
        const index = state.posts.findIndex((post) => post.id === action.id);

        let postsCopy = [...state.posts];
        if (index >= 0){
          postsCopy.splice(index,1);
        }
        return {...state, posts: postsCopy}
        case "EDIT_POST":
        const preEditPosts = [...state.posts];
        const postEditPosts = preEditPosts.map(post => 
        post.id === action.id ? action.post : post
        )
        return {...state, posts: postEditPosts}
        case "INIT_USER":
        return {...state, user:action.user}
        case "SIGN_IN":
          return {...state, user:action.user}
        case "SIGN_OUT":
          return {...state, user:action.user}
        default:
      return state;
  }
};

export default reducer;
