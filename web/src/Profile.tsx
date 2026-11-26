import { AuthForm } from "./AuthForm";
import { useSession } from "./useSession";
import { supabase } from "./supabase";

export function Profile(){
    const session = useSession()
    return(
        <div className="page">
            {session === null && <AuthForm/>}
            {session && (<>
                <h1>Profile</h1>
                <p>{session.user.email}</p>
                <button onClick={() => void supabase.auth.signOut()}>Log out</button>
                </>
            )}
        </div>
    )
}