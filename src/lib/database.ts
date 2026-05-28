import { createSupabaseBrowser } from "./supabase-browser";
import type { Project, UserProfile } from "@/types";

const supabase = createSupabaseBrowser();

export async function saveProject(
  userId: string,
  youtubeUrl: string,
  videoTitle: string,
  transcript: string,
  generatedContent: unknown,
  status: "processing" | "completed" | "failed"
): Promise<Project | null> {
  const { data, error } = await supabase
    .from("projects")
    .insert({
      user_id: userId,
      youtube_url: youtubeUrl,
      video_title: videoTitle,
      transcript,
      generated_content: generatedContent,
      status,
    })
    .select()
    .single();

  if (error) {
    console.error("Save project error:", error);
    return null;
  }
  return data as Project;
}

export async function getProjects(userId: string): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Get projects error:", error);
    return [];
  }
  return (data || []) as Project[];
}

export async function getProject(
  projectId: string
): Promise<Project | null> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();

  if (error) return null;
  return data as Project;
}

export async function getProfile(
  userId: string
): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) return null;
  return data as UserProfile;
}

export async function incrementUsage(userId: string): Promise<void> {
  const { error } = await supabase.rpc("increment_usage", {
    user_id_input: userId,
  });
  if (error) {
    // Fallback: manual increment
    const profile = await getProfile(userId);
    if (profile) {
      await supabase
        .from("profiles")
        .update({ generations_used: profile.generations_used + 1 })
        .eq("id", userId);
    }
  }
}

export async function updateProfile(
  userId: string,
  updates: Partial<Pick<UserProfile, "plan">>
): Promise<void> {
  await supabase.from("profiles").update(updates).eq("id", userId);
}
