import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react"
import { ProjectImpl } from "@squire-ui/lib/models/project.model";
import Link from "next/link"

const Projects = () => {
  const router = useRouter()
  const supabase = useSupabaseClient<any>()
  const [projects, setProjects] = useState<ProjectImpl[]>();

  useEffect(() => {
    const fetchProjects = async () => {
      const { data: projects, error } = await supabase
        .from("projects")
        .select("*")
        .order("id", { ascending: true })

      let _projects = projects?.map((p) => new ProjectImpl(p))

      if (error) console.log("error", error)
      else setProjects(_projects)
    }

    fetchProjects()
  }, [supabase])


  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        {/* head */}
        <thead>
          <tr>
            <th></th>
            <th>ID</th>
            <th>NAME</th>
            <th>FILE DESCRIPTION</th>
          </tr>
        </thead>
        <tbody>
          { projects?.map((pj, idx) =>
            <tr>
              <th>{idx + 1}</th>
              <td>
                <Link href={"/projects/" + pj.id} key={idx}> 
                {pj.id}
                </Link>
              </td>
              <td>{pj.name}</td>
              <td>{pj.fs_descriptor}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Projects