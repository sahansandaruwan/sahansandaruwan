import React from 'react';
import { Mail, Github, Linkedin, MapPin, ArrowUpRight, Code, Briefcase, GraduationCap } from 'lucide-react';
import { AuthorProfile } from '../types';
import { loadAboutContent } from '../utils/aboutContentLoader';

interface AboutViewProps {
  author: AuthorProfile;
  onSelectTag?: (tag: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ author }) => {
  const content = loadAboutContent();
  const displayAuthor = {
    ...author,
    name: content.name || author.name,
    tagline: content.tagline || author.tagline,
    location: content.location || author.location,
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-14 animate-fade-in space-y-8 sm:space-y-10">
      
      {/* Header Profile */}
      <section className="space-y-4">
        {displayAuthor.avatarUrl ? (
          <img
            src={displayAuthor.avatarUrl}
            alt={displayAuthor.name}
            className="w-16 h-16 rounded-full object-cover border border-current/20 shrink-0 shadow-xs"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-current/10 flex items-center justify-center font-hn-reader font-bold text-xl border border-current/20">
            {displayAuthor.name.charAt(0)}
          </div>
        )}

        <div>
          <h1 className="text-2xl sm:text-3xl font-hn-reader font-bold tracking-tight">
            {displayAuthor.name}
          </h1>
          <p className="text-sm sm:text-base opacity-80 mt-1 font-hn-reader leading-relaxed">
            {displayAuthor.tagline}
          </p>
        </div>

        {displayAuthor.location && (
          <p className="text-xs font-mono-reader opacity-60 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            {displayAuthor.location}
          </p>
        )}
      </section>

      {/* About Section */}
      <section className="space-y-3 border-t border-current/10 pt-8">
        <h2 className="text-lg font-hn-reader font-bold">About</h2>
        <p className="text-sm leading-relaxed opacity-90 font-hn-reader">
          {content.about}
        </p>
      </section>

      {/* Skills Section */}
      <section className="space-y-3 border-t border-current/10 pt-8">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 opacity-70" />
          <h2 className="text-lg font-hn-reader font-bold">Skills</h2>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-mono-reader">
          {content.skills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1.5 rounded-md bg-current/5 border border-current/10 opacity-90 font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* Selected Work Section */}
      <section className="space-y-4 border-t border-current/10 pt-8">
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 opacity-70" />
          <h2 className="text-lg font-hn-reader font-bold">Selected Work</h2>
        </div>
        <div className="space-y-4 text-xs sm:text-sm">
          {content.selectedWork.map((project) => (
            <div
              key={project.title}
              className="p-4 rounded-lg border border-current/10 bg-current/5 hover:border-current/20 transition-all space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-hn-reader font-bold text-base flex items-center gap-1.5">
                  {project.title}
                </h3>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 rounded opacity-60 hover:opacity-100 hover:bg-current/10 transition-colors"
                    title="View Project"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                )}
              </div>
              <p className="opacity-80 leading-relaxed font-hn-reader text-xs sm:text-sm">
                {project.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Education Section */}
      <section className="space-y-4 border-t border-current/10 pt-8">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 opacity-70" />
          <h2 className="text-lg font-hn-reader font-bold">Education</h2>
        </div>
        <div className="divide-y divide-current/10 text-xs sm:text-sm">
          {content.education.map((edu) => (
            <div key={edu.title} className="py-3 flex items-center justify-between">
              <div>
                <p className="font-bold font-hn-reader text-sm">{edu.title}</p>
                <p className="text-xs opacity-60 font-hn-reader mt-0.5">
                  {edu.institution} · {edu.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Connect & Reach Out */}
      <section className="border-t border-current/10 pt-8 space-y-4">
        <h2 className="text-lg font-hn-reader font-bold">Connect & Reach Out</h2>
        <div className="flex flex-wrap gap-3 text-xs font-mono-reader">
          {content.contacts.map((contact) => {
            const lowerLabel = contact.label.toLowerCase();
            let IconComponent = Mail;
            if (lowerLabel.includes('github')) IconComponent = Github;
            else if (lowerLabel.includes('linkedin')) IconComponent = Linkedin;
            else if (lowerLabel.includes('email')) IconComponent = Mail;

            return (
              <a
                key={contact.label}
                href={contact.url || contact.value}
                target={contact.url?.startsWith('http') ? '_blank' : undefined}
                rel={contact.url?.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="px-3 py-2 rounded-md border border-current/20 hover:bg-current/10 transition-colors flex items-center gap-2 opacity-90 hover:opacity-100"
              >
                <IconComponent className="w-3.5 h-3.5" />
                <span>{contact.value}</span>
                {contact.url?.startsWith('http') && <ArrowUpRight className="w-3 h-3 opacity-50" />}
              </a>
            );
          })}
        </div>
      </section>

    </div>
  );
};
