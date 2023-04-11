// import { supabase } from '../lib/supabaseClient' 

// export function useLatestGeneration() {
//     useEffect(function subscribe() {
//         if (!route?.id) return
    
//         // TODO: SECURITY - Enable row security for all tables and configure access to deployments.
//         const insertSub = client.channel('any')
//           .on('postgres_changes',
//             {
//               event: 'INSERT',
//               schema: 'public',
//               table: deploymentsTable,
//               filter: `project_id=eq.${project.id}`,
//             }, payload => {
//               if (payload.new.route_id === route.id) {
//                 setDeployment(payload.new as deployments)
//               }
//             })
//           .subscribe()
    
//         // TODO: SECURITY - Enable row security for all tables and configure access to deployments.
//         const updateSub = client.channel('any')
//           .on('postgres_changes',
//             {
//               event: 'UPDATE',
//               schema: 'public',
//               table: deploymentsTable,
//               filter: `project_id=eq.${project.id}`,
//             }, payload => {
//               if (payload.new.route_id === route.id) {
//                 setDeployment(payload.new as deployments)
//               }
//             })
//           .subscribe()
    
//         return () => {
//           insertSub.unsubscribe()
//           updateSub.unsubscribe()
//         }
//       }, [
//         client,
//         project.id,
//         route?.id,
//       ])
// }