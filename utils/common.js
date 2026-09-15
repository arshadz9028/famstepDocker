
export const userName = async (getSession )=>{
    const session = await getSession;

 return session?.user?.username  


}

