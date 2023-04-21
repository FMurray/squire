import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState } from "react"
import { ProjectImpl } from "@squire-ui/lib/models/project.model";

const Project = () => {
  const router = useRouter()
  const { id } = router.query
  const supabase = useSupabaseClient<any>()
  const [projects, setProjects] = useState<ProjectImpl>();

  return (
    <p>Project: {id}</p>
  )
}

export default Project