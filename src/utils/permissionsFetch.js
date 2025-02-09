import {supabase} from '../utils/dataBase';
export async function FetchPermissions(date,organization) {
    try {
        const { data : permissions, error } = await supabase
        .from("permissions") // Your user table
        .select("*")
        .eq("date", date)
        .eq("organization", organization); // Ensure only one result is returned
        console.log(permissions)
        return {success: true , data :permissions}; // Assuming it returns { success: true, user: { ... } }
    } catch (error) {
        return { success: false, error: error.response?.data || "لا توجد بيانات" };
    }
}
