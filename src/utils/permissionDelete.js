import { supabase } from "../utils/dataBase";

export async function DeletePermissions(id) {
    try {
        // ✅ Ensure the `id` is provided
        if (!id) {
            throw new Error("يجب تحديد المعرف لحذف الصلاحية");
        }

        // ✅ Delete from the "permissions" table
        const { error } = await supabase
            .from("permissions") 
            .delete()
            .eq("id", id);

        // ✅ Handle errors properly
        if (error) {
            throw new Error(error.message);
        }

        return { success: true };

    } catch (error) {
        console.error("Error in DeletePermissions:", error.message);
        return { success: false, error: error.message || "حدث خطأ غير متوقع" };
    }
}
