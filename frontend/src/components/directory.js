import React from "react";

const ProjectStructureDropdown = ({ structure }) => {
  if (!structure || structure.length === 0) {
    return <div>No files to display.</div>;
  }

  return (
    <ul className="space-y-2">
      {structure.map((item, index) => (
        <li key={index} className="font-medium text-gray-800">
          {item.type === "folder" ? (
            <span>{item.name}</span>
          ) : (
            <a
              href={`http://localhost:5000/backend/output/${item.name}`}
              download={item.name}
              className="text-blue-500 hover:underline"
            >
              {item.name}
            </a>
          )}
          {item.children && (
            <ul className="ml-4">
              {item.children.map((child, i) => (
                <li key={i}>
                  <a
                    href={`http://localhost:5000/backend/output/${child.name}`}
                    download={child.name}
                    className="text-blue-500 hover:underline"
                  >
                    {child.name}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
};

export default ProjectStructureDropdown;
