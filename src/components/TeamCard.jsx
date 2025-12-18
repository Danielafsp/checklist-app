import "../styles/TeamCard.css";

export default function TeamCard({ member }) {
  return (
    <div className="team-card">
      <h3 className="team-name">{member.name}</h3>
      <p className="team-title">{member.title}</p>

      <div className="team-info">
        <p>📍 {member.city}</p>
        <p>
          📞 <a href={`phone:${member.phone}`}>{member.phone}</a>
        </p>
        <p>
          ✉️ <a href={`mailto:${member.email}`}>{member.email}</a>
        </p>
      </div>
    </div>
  );
}
