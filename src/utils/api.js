import {supabase} from '../utils/dataBase';
export async function loginUser(cid, fid) {
    try {
        const { data, error } = await supabase
        .from("users") // Your user table
        .select("*")
        .eq("cid", cid)
        .eq("fid", fid)
        .in("perk",['vp','admin']) // Consider hashing passwords instead of storing plain text
        .single(); // Ensure only one result is returned
          
        return {success: true , user :data}; // Assuming it returns { success: true, user: { ... } }
    } catch (error) {
        return { success: false, error: error.response?.data || "Login failed" };
    }
}
