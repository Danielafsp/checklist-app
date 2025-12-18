import { teamData } from "../data/teamData";
import Teamcard from "../components/TeamCard";
import "../styles/Team.css";
import TeamCard from "../components/TeamCard";

export default function Team() {
  return (
    <div className="team-page">
      <h1> Fort Sands Team</h1>
      <p className="team-subtitle">
        Get in touch with the right person for your needs.
      </p>

      <div className="team-grid">
        {teamData.map((member) => (
          <TeamCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
}
