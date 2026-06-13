import Link from "next/link";

export default function
EditorDashboard() {

  return (

    <main>

      <section>

        <h1>

          Editorial Workspace

        </h1>

        <p>

          Manage drafts,
          published stories,
          and analytics.

        </p>

      </section>

        <div className="grid grid-cols-2 gap-6">

  <Link
    href="/editor/new"
    className="rounded-xl border p-6"
  >
    <h3>New Article</h3>
    <p>Create a new draft</p>
  </Link>

  <Link
    href="/editor/drafts"
    className="rounded-xl border p-6"
  >
    <h3>Drafts</h3>
    <p>Continue editing</p>
  </Link>

  <Link
    href="/editor/published"
    className="rounded-xl border p-6"
  >
    <h3>Published</h3>
    <p>Manage live stories</p>
  </Link>

  <Link
    href="/editor/analytics"
    className="rounded-xl border p-6"
  >
    <h3>Analytics</h3>
    <p>Track performance</p>
  </Link>

</div>


    </main>
  )
}