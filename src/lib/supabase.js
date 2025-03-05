// import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error("Missing Supabase environment variables");
// }

// export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// // Auth helpers
// export const signUp = async ({ email, password, name }) => {
//   const { data, error } = await supabase.auth.signUp({
//     email,
//     password,
//     options: {
//       data: {
//         name,
//       },
//     },
//   });
//   return { data, error };
// };

// export const signIn = async ({ email, password }) => {
//   const { data, error } = await supabase.auth.signInWithPassword({
//     email,
//     password,
//   });
//   return { data, error };
// };

// export const signOut = async () => {
//   const { error } = await supabase.auth.signOut();
//   return { error };
// };

// // Customers
// export const getCustomers = async () => {
//   const { data, error } = await supabase
//     .from("customers")
//     .select("*")
//     .order("created_at", { ascending: false });
//   return { data, error };
// };

// export const createCustomer = async (customer, user) => {
//   const { data, error } = await supabase
//     .from("customers")
//     .insert([{ ...customer, user_id: user?.id }])
//     .select()
//     .single();
//   return { data, error };
// };

// export const updateCustomer = async (id, updates) => {
//   const { data, error } = await supabase
//     .from("customers")
//     .update(updates)
//     .eq("id", id)
//     .select()
//     .single();
//   return { data, error };
// };

// export const deleteCustomer = async (id) => {
//   const { error } = await supabase.from("customers").delete().eq("id", id);
//   return { error };
// };

// // Posts
// export const getPosts = async () => {
//   const { data, error } = await supabase
//     .from("posts")
//     .select("*, categories(name)")
//     .order("created_at", { ascending: false });
//   return { data, error };
// };

// export const createPost = async (post) => {
//   const { data, error } = await supabase
//     .from("posts")
//     .insert([{ ...post, user_id: supabase.auth.user()?.id }])
//     .select()
//     .single();
//   return { data, error };
// };

// export const updatePost = async (id, updates) => {
//   const { data, error } = await supabase
//     .from("posts")
//     .update(updates)
//     .eq("id", id)
//     .select()
//     .single();
//   return { data, error };
// };

// export const deletePost = async (id) => {
//   const { error } = await supabase.from("posts").delete().eq("id", id);
//   return { error };
// };

// // Pages
// export const getPages = async () => {
//   const { data, error } = await supabase
//     .from("pages")
//     .select("*")
//     .order("created_at", { ascending: false });
//   return { data, error };
// };

// export const createPage = async (page) => {
//   const { data, error } = await supabase
//     .from("pages")
//     .insert([{ ...page, user_id: supabase.auth.user()?.id }])
//     .select()
//     .single();
//   return { data, error };
// };

// export const updatePage = async (id, updates) => {
//   const { data, error } = await supabase
//     .from("pages")
//     .update(updates)
//     .eq("id", id)
//     .select()
//     .single();
//   return { data, error };
// };

// export const deletePage = async (id) => {
//   const { error } = await supabase.from("pages").delete().eq("id", id);
//   return { error };
// };

// // Categories
// export const getCategories = async () => {
//   const { data, error } = await supabase
//     .from("categories")
//     .select("*")
//     .order("name", { ascending: true });
//   return { data, error };
// };

// export const createCategory = async (category) => {
//   const { data, error } = await supabase
//     .from("categories")
//     .insert([{ ...category, user_id: supabase.auth.user()?.id }])
//     .select()
//     .single();
//   return { data, error };
// };

// export const updateCategory = async (id, updates) => {
//   const { data, error } = await supabase
//     .from("categories")
//     .update(updates)
//     .eq("id", id)
//     .select()
//     .single();
//   return { data, error };
// };

// export const deleteCategory = async (id) => {
//   const { error } = await supabase.from("categories").delete().eq("id", id);
//   return { error };
// };

// // Media
// export const getMedia = async () => {
//   const { data, error } = await supabase
//     .from("media")
//     .select("*")
//     .order("created_at", { ascending: false });
//   return { data, error };
// };

// export const createMedia = async (media) => {
//   const { data, error } = await supabase
//     .from("media")
//     .insert([{ ...media, user_id: supabase.auth.user()?.id }])
//     .select()
//     .single();
//   return { data, error };
// };

// export const deleteMedia = async (id) => {
//   const { error } = await supabase.from("media").delete().eq("id", id);
//   return { error };
// };

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helpers
export const signUp = async ({ email, password, name }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });
  return { data, error };
};

export const signIn = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// Customers
export const getCustomers = async () => {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .order("created_at", { ascending: false });
  return { data, error };
};

export const createCustomer = async (customer) => {
  // Get current user session
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user_id = session?.user?.id;

  if (!user_id) {
    return { error: new Error("No authenticated user") };
  }

  const { data, error } = await supabase
    .from("customers")
    .insert([{ ...customer, user_id }])
    .select()
    .single();
  return { data, error };
};

export const updateCustomer = async (id, updates) => {
  const { data, error } = await supabase
    .from("customers")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  return { data, error };
};

export const deleteCustomer = async (id) => {
  const { error } = await supabase.from("customers").delete().eq("id", id);
  return { error };
};

// Posts
export const getPosts = async () => {
  const { data, error } = await supabase
    .from("posts")
    .select("*, categories(name)")
    .order("created_at", { ascending: false });
  return { data, error };
};

export const createPost = async (post) => {
  console.log(post, "<----post");
  // Get current user session
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user_id = session?.user?.id;

  if (!user_id) {
    return { error: new Error("No authenticated user") };
  }

  const { data, error } = await supabase
    .from("posts")
    .insert([{ ...post, user_id }])
    .select()
    .single();
  return { data, error };
};

export const updatePostApi = async (id, updates) => {
  const { data, error } = await supabase
    .from("posts")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  return { data, error };
};

export const deletePost = async (id) => {
  const { error } = await supabase.from("posts").delete().eq("id", id);
  return { error };
};

// Pages
export const getPages = async () => {
  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .order("created_at", { ascending: false });
  return { data, error };
};

export const createPage = async (page) => {
  // Get current user session
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user_id = session?.user?.id;

  if (!user_id) {
    return { error: new Error("No authenticated user") };
  }

  const { data, error } = await supabase
    .from("pages")
    .insert([{ ...page, user_id }])
    .select()
    .single();
  return { data, error };
};

export const updatePageApi = async (id, updates) => {
  const { data, error } = await supabase
    .from("pages")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  return { data, error };
};

export const deletePage = async (id) => {
  const { error } = await supabase.from("pages").delete().eq("id", id);
  return { error };
};

// Categories
export const getCategories = async () => {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });
  return { data, error };
};

export const createCategory = async (category) => {
  // Get current user session
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user_id = session?.user?.id;

  if (!user_id) {
    return { error: new Error("No authenticated user") };
  }

  const { data, error } = await supabase
    .from("categories")
    .insert([{ ...category, user_id }])
    .select()
    .single();
  return { data, error };
};

export const updateCategoryApi = async (id, updates) => {
  const { data, error } = await supabase
    .from("categories")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  return { data, error };
};

export const deleteCategory = async (id) => {
  const { error } = await supabase.from("categories").delete().eq("id", id);
  return { error };
};

// Media
export const getMedia = async () => {
  const { data, error } = await supabase
    .from("media")
    .select("*")
    .order("created_at", { ascending: false });
  return { data, error };
};

export const createMedia = async (media) => {
  // Get current user session
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user_id = session?.user?.id;

  if (!user_id) {
    return { error: new Error("No authenticated user") };
  }

  const { data, error } = await supabase
    .from("media")
    .insert([{ ...media[0] }])
    .select()
    .single();
  return { data, error };
};

export const deleteMedia = async (id) => {
  const { error } = await supabase.from("media").delete().eq("id", id);
  return { error };
};

export const signInWithOtp = async (phone, token = null) => {
  if (!token) {
    // Request OTP
    return await supabase.auth.signInWithOtp({ phone });
  } else {
    // Verify OTP
    return await supabase.auth.verifyOtp({ phone, token, type: "sms" });
  }
};
