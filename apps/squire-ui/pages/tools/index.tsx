import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react"
import { ToolImpl } from "@squire-ui/lib/models/tool.model";
import Link from "next/link"
import { Edit } from "react-feather"
import { open } from '@tauri-apps/api/dialog';

export function GetAppConventions() {
  const [dir, setDir] = useState<any>()


  const handlePickFile = async (e) => {
    e.preventDefault()
    const selected = await open({
      directory: true,
    });

    console.log(typeof selected)

    setDir(selected)
  }

  return (
    <div className="flex-1 card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">
          Get App Conventions
          <div className="badge badge-primary">Document Loader</div>  
        </h2>
        <p>        
          "Gets the conventions used in the application"
          "Useful for when you want to figure out how to make new files, features or functionality"
        </p>
        <div className="flex">
          <code className="me-10">{dir}</code> 
          <Edit onClick={handlePickFile} className="cursor-pointer"></Edit>
        </div>
      </div>
    </div>
  )
}

const tools = [
  GetAppConventions
]

export default function ToolList() {

    // const supabase = useSupabaseClient<any>()
    // const [tools, setTools] = useState<ToolImpl[]>();
  
    // useEffect(() => {
    //   const fetchTools = async () => {
    //     const { data: tools, error } = await supabase
    //       .from("tools")
    //       .select("*")
    //       .order("id", { ascending: true })
  
    //     let _tools = tools?.map((p) => new ToolImpl(p))
    //     console.log(_tools)
  
    //     if (error) console.log("error", error)
    //     else setTools(_tools)
    //   }
  
    //   fetchTools()
    // }, [supabase])


    return (
      <section className="flex m-10">
        { tools?.map((tl) => tl() )}
        {/* { tools?.map((tl) => 
          <div className="flex-1 card w-96 bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">{tl.name}</h2>
              <p>{tl.prefix}</p>
              <p>{tl.suffix}</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary">Edit</button>
              </div>
            </div>
          </div>
        )} */}
      </section>
    )
}

