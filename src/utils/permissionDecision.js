import { supabase } from "../utils/dataBase";

export async function ManagePermissions(id, decision) {
    try {
        // ✅ Ensure the `id` and `decision` are provided
        if (!id || !decision) {
            throw new Error("يجب تحديد المعرف و القرار");
        }

        // ✅ Update the "permissions" table
        const { data: permissions, error } = await supabase
            .from("permissions") 
            .update({ management_reply: decision }) // ✅ Corrected update syntax
            .eq("id", id) // ✅ Ensure the update is for the correct row
            .select();

        // ✅ Handle errors properly
        if (error) {
            throw new Error(error.message);
        }

        return { success: true, data: permissions }; // ✅ Return updated data

    } catch (error) {
        console.error("Error in ManagePermissions:", error.message);
        return { success: false, error: error.message || "لا توجد بيانات" };
    }
}
