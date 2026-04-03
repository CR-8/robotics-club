interface Project {
  id: number;
  tag: string;
  title: string;
  description: string;
  image: string;
  color: string;
}

interface ProjectCardProps {
  project: Project;
  index: number;
  total: number;
}

export default function ProjectCard({ project, index, total }: ProjectCardProps) {
  return (
    <div
      className="project-card"
      id={`project-card-${project.id}`}
      style={{
        backgroundColor: project.color,
        zIndex: total - index,
      }}
    >
      <div className="project-card__col project-card__col--text">
        <p className="project-card__tag">{project.tag}</p>
        <h1 className="project-card__title">{project.title}</h1>
        <p className="project-card__desc">{project.description}</p>
      </div>
      <div className="project-card__col project-card__col--image">
        <img src={project.image} alt={project.title} />
      </div>
    </div>
  );
}
