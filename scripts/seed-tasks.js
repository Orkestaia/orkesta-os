
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error("❌ Missing Supabase URL or Service Key");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedTasks() {
    console.log("🚀 Seeding Sample Tasks...");

    const tasks = [
        { title: "Review Q4 Budgets", status: "To Do", priority: "High", description: "Analyze expense reports." },
        { title: "Call with Client A", status: "In Progress", priority: "Medium", description: "Discuss renewal contract." },
        { title: "Update Website Logo", status: "Done", priority: "Low", description: "Replace old asset with new SVG." },
        { title: "Preparation Meeting", status: "To Do", priority: "Medium", description: "Prepare slides for Monday." }
    ];

    const { error } = await supabase.from('tasks').insert(tasks);

    if (error) console.error("❌ Error inserting tasks:", error.message);
    else console.log("✅ Tasks inserted successfully!");
}

seedTasks();
