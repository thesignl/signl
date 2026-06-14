'use client'


import UserTable from '@/features/admin/UserTable'
import {
 getUsers
}
from '@/services/admin.service'
import { useEffect, useState } from 'react'



export default function
UsersPage() {

 const [users, setUsers] =
        useState([])

    useEffect(() => {

        const loadUsers = async () => {

        const data =
            await getUsers()

        setUsers(data)
        }

        loadUsers()

    }, [])


 return (

  <main>

   <h1>

    User Management

   </h1>

   <UserTable
    users={users}
   />

  </main>
 )
}