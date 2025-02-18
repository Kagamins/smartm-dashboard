import { supabase } from "./dataBase";
 export async function FetchNotices( ) {
    try {
        const { data : notices, error } = await supabase
        .from("notice") // Your user table
        .select("*")
         return {success: true , data :notices}; // Assuming it returns { success: true, user: { ... } }
    } catch (error) {
        return { success: false, error: error.response?.data || "لا توجد بيانات" };
    }
}
