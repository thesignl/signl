interface Props {

  title: string

  value: number
}

export default function
StatCard({

  title,

  value

}: Props) {

  return (

    <div className="stat-card">

      <div className="stat-label">

        {title}

      </div>

      <div className="stat-value">

        {value}

      </div>

    </div>
  )
}
