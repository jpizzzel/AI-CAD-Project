import React from "react";

const ProjectStructureTooltip = ({ structure }) => {
  if (!structure || structure.length === 0) {
    return (
      <div className="text-gray-500 text-sm italic">
        No files to display.
      </div>
    );
  }

  const getDisplayName = (item) => {
    const filename = item.name.split('/').pop();
    return filename.replace('source.', 'filename.');
  };

  const renderStructure = (items, depth = 0) => {
    return items.map((item, index) => (
      <li key={`${depth}-${index}`} className="py-1">
        {item.type === "folder" ? (
          <>
            {item.children && (
              <ul className="space-y-1">
                {renderStructure(item.children, depth + 1)}
              </ul>
            )}
          </>
        ) : (
          <a
            href={`http://localhost:5000${item.name.replace("./output", "/output")}`}
            download={getDisplayName(item)}
            className="text-blue-500 hover:underline flex items-center gap-2 px-2 py-1 rounded hover:bg-[#2a2f3a] transition-colors"
            title={getDisplayName(item)}
          >
            <span className="flex-shrink-0">📄</span>
            <span className="truncate">{getDisplayName(item)}</span>
          </a>
        )}
      </li>
    ));
  };

  return (
    <div className="relative group inline-block">
      <div className="border-2 border-grey-500 bg-[#222630] py-2 px-4 rounded-md shadow-lg flex justify-center items-center gap-4 cursor-pointer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 18 14"
          height={25}
          width={25}
        >
          <path
            fill="#FFA000"
            d="M16.2 1.75H8.1L6.3 0H1.8C0.81 0 0 0.7875 0 1.75V12.25C0 13.2125 0.81 14 1.8 14H15.165L18 9.1875V3.5C18 2.5375 17.19 1.75 16.2 1.75Z"
          />
          <path
            fill="#FFCA28"
            d="M16.2 2H1.8C0.81 2 0 2.77143 0 3.71429V12.2857C0 13.2286 0.81 14 1.8 14H16.2C17.19 14 18 13.2286 18 12.2857V3.71429C18 2.77143 17.19 2 16.2 2Z"
          />
        </svg>
        <p>Project Structure</p>
      </div>
      <div className="absolute left-0 mt-2 w-56 bg-[#222630] border border-gray-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <ul className="p-2 space-y-1">{renderStructure(structure)}</ul>
      </div>
    </div>
  );
};

export default ProjectStructureTooltip;
