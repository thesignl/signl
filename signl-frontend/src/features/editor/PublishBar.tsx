'use client'

import {
 publishDraft
}
from '@/services/editor.service'

export default function
PublishBar({

 articleId

}: any) {

 const publish =
 async () => {

   await publishDraft(
     articleId
   )

   alert(
     'Published'
   )
 }

 return (

   <div
     className="publish-bar"
   >

     <button
       onClick={publish}
     >

       Publish

     </button>

   </div>
 )
}