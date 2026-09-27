import { IDCardLanyard } from "@/components/ui/id-card-lanyard";

export default function DemoOne() {
  return (
    <IDCardLanyard
      name="Deric Andrews"
      role="Full-Stack Dev & AI Creator"
      brand="DERIC ANDREWS"
      brandTagline="Creative Technologist"
      pillars={["Creative Code", "AI & Automation", "Real Impact"]}
      location="Linz, Austria"
      photoUrl="/images/about/starting.png"
      githubUrl="https://github.com"
      linkedinUrl="https://linkedin.com"
      instagramUrl="https://instagram.com"
    />
  );
}
