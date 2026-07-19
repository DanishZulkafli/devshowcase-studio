const STORAGE_KEY = "devshowcase_studio_v1";

const defaultData = {
  projects: [
    {
      id: "p1",
      name: "AI Personal Finance Coach",
      category: "AI Application",
      status: "Improving",
      progress: 82,
      description: "A smart personal finance dashboard that tracks income, expenses, savings goals and budgeting recommendations.",
      tech: "HTML, CSS, JavaScript",
      repo: "",
      demo: "",
      impact: "High Impact"
    },
    {
      id: "p2",
      name: "ResearchMate AI Literature Planner",
      category: "Education Tool",
      status: "Completed",
      progress: 90,
      description: "A research planning tool that helps users organize papers, research gaps, notes and writing plans.",
      tech: "HTML, CSS, JavaScript",
      repo: "",
      demo: "",
      impact: "High Impact"
    },
    {
      id: "p3",
      name: "EcoPulse Carbon Habit Coach",
      category: "Dashboard",
      status: "In Progress",
      progress: 76,
      description: "A sustainability habit tracker that monitors eco actions and gives carbon footprint improvement suggestions.",
      tech: "HTML, CSS, JavaScript",
      repo: "",
      demo: "",
      impact: "Medium Impact"
    }
  ],

  skills: [
    {
      id: "s1",
      name: "HTML",
      category: "Frontend",
      level: 90
    },
    {
      id: "s2",
      name: "CSS",
      category: "Frontend",
      level: 86
    },
    {
      id: "s3",
      name: "JavaScript",
      category: "Frontend",
      level: 78
    },
    {
      id: "s4",
      name: "PHP",
      category: "Backend",
      level: 72
    }
  ],

  tasks: [
    {
      id: "t1",
      title: "Add screenshots to project README files",
      priority: "High",
      stage: "todo"
    },
    {
      id: "t2",
      title: "Deploy one project using GitHub Pages",
      priority: "High",
      stage: "doing"
    },
    {
      id: "t3",
      title: "Add useful topics to every repository",
      priority: "Medium",
      stage: "done"
    }
  ]
};

let data = loadData();

const $ = (id) => document.getElementById(id);

function loadData() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    return structuredClone(defaultData);
  }

  try {
    return JSON.parse(saved);
  } catch {
    return structuredClone(defaultData);
  }
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getCompletedProjects() {
  return data.projects.filter((project) => project.status === "Completed").length;
}

function getAverageProgress() {
  if (!data.projects.length) {
    return 0;
  }

  const total = data.projects.reduce((sum, project) => sum + Number(project.progress), 0);
  return Math.round(total / data.projects.length);
}

function getOpenTasks() {
  return data.tasks.filter((task) => task.stage !== "done").length;
}

function renderStats() {
  $("totalProjects").textContent = data.projects.length;
  $("completedProjects").textContent = getCompletedProjects();
  $("averageProgress").textContent = `${getAverageProgress()}%`;
  $("openTasks").textContent = getOpenTasks();

  $("heroProjectCount").textContent = data.projects.length;
  $("heroSkillCount").textContent = data.skills.length;
  $("heroTaskCount").textContent = data.tasks.length;

  const mission =
    data.tasks.find((task) => task.stage === "doing") ||
    data.tasks.find((task) => task.stage === "todo");

  $("todayMission").textContent = mission ? mission.title : "Create one GitHub improvement";
}

function renderProjects() {
  const list = $("projectList");
  const searchValue = $("projectSearch").value.toLowerCase().trim();
  const filterValue = $("projectFilter").value;

  const filtered = data.projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchValue) ||
      project.description.toLowerCase().includes(searchValue) ||
      project.tech.toLowerCase().includes(searchValue) ||
      project.category.toLowerCase().includes(searchValue);

    const matchesFilter = filterValue === "All" || project.category === filterValue;

    return matchesSearch && matchesFilter;
  });

  if (!filtered.length) {
    list.innerHTML = `<div class="empty">No projects found.</div>`;
    return;
  }

  list.innerHTML = filtered
    .map((project) => {
      const techBadges = project.tech
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
        .map((item) => `<span class="badge">${escapeHTML(item)}</span>`)
        .join("");

      const repoButton = project.repo
        ? `<a class="small-btn" href="${escapeHTML(project.repo)}" target="_blank">Repository</a>`
        : "";

      const demoButton = project.demo
        ? `<a class="small-btn" href="${escapeHTML(project.demo)}" target="_blank">Live Demo</a>`
        : "";

      return `
        <article class="project-card">
          <div class="project-top">
            <div>
              <h3>${escapeHTML(project.name)}</h3>
              <p>${escapeHTML(project.description)}</p>
            </div>
          </div>

          <div class="badges">
            <span class="badge">${escapeHTML(project.category)}</span>
            <span class="badge">${escapeHTML(project.status)}</span>
            <span class="badge">${escapeHTML(project.impact)}</span>
            ${techBadges}
          </div>

          <div class="progress-wrap">
            <div class="progress-label">
              <span>Project Progress</span>
              <span>${Number(project.progress)}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${Number(project.progress)}%"></div>
            </div>
          </div>

          <div class="card-actions">
            ${repoButton}
            ${demoButton}
            <button class="small-btn" data-action="increaseProject" data-id="${project.id}">+ Progress</button>
            <button class="small-btn danger" data-action="deleteProject" data-id="${project.id}">Delete</button>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderSkills() {
  const list = $("skillList");

  if (!data.skills.length) {
    list.innerHTML = `<div class="empty">No skills added yet.</div>`;
    return;
  }

  const sortedSkills = [...data.skills].sort((a, b) => Number(b.level) - Number(a.level));

  list.innerHTML = sortedSkills
    .map((skill) => {
      return `
        <article class="skill-item">
          <div class="skill-head">
            <div>
              <strong>${escapeHTML(skill.name)}</strong>
              <span>${escapeHTML(skill.category)}</span>
            </div>
            <strong>${Number(skill.level)}%</strong>
          </div>

          <div class="progress-bar">
            <div class="progress-fill" style="width: ${Number(skill.level)}%"></div>
          </div>

          <div class="skill-actions">
            <button class="small-btn" data-action="increaseSkill" data-id="${skill.id}">Improve</button>
            <button class="small-btn danger" data-action="deleteSkill" data-id="${skill.id}">Delete</button>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderTasks() {
  const columns = {
    todo: $("todoTasks"),
    doing: $("doingTasks"),
    done: $("doneTasks")
  };

  Object.values(columns).forEach((column) => {
    column.innerHTML = "";
  });

  Object.keys(columns).forEach((stage) => {
    const tasks = data.tasks.filter((task) => task.stage === stage);

    if (!tasks.length) {
      columns[stage].innerHTML = `<div class="empty">No tasks here.</div>`;
      return;
    }

    columns[stage].innerHTML = tasks
      .map((task) => {
        return `
          <article class="task-card">
            <h4>${escapeHTML(task.title)}</h4>
            <p>Priority: ${escapeHTML(task.priority)}</p>

            <div class="task-actions">
              ${
                stage !== "todo"
                  ? `<button class="small-btn" data-action="moveTask" data-stage="todo" data-id="${task.id}">To Do</button>`
                  : ""
              }

              ${
                stage !== "doing"
                  ? `<button class="small-btn" data-action="moveTask" data-stage="doing" data-id="${task.id}">Doing</button>`
                  : ""
              }

              ${
                stage !== "done"
                  ? `<button class="small-btn" data-action="moveTask" data-stage="done" data-id="${task.id}">Done</button>`
                  : ""
              }

              <button class="small-btn danger" data-action="deleteTask" data-id="${task.id}">Delete</button>
            </div>
          </article>
        `;
      })
      .join("");
  });
}

function renderAll() {
  renderStats();
  renderProjects();
  renderSkills();
  renderTasks();
}

function generateSampleProject() {
  const ideas = [
    {
      name: "BugFix Tracker Pro",
      category: "Productivity Tool",
      status: "Planning",
      progress: 35,
      description: "A simple bug tracking dashboard for recording issues, severity, status, screenshots and fix notes.",
      tech: "HTML, CSS, JavaScript",
      repo: "",
      demo: "",
      impact: "Medium Impact"
    },
    {
      name: "CodeSprint Habit Tracker",
      category: "Dashboard",
      status: "Planning",
      progress: 40,
      description: "A developer habit tracker that helps users track coding days, GitHub commits, learning hours and project milestones.",
      tech: "HTML, CSS, JavaScript",
      repo: "",
      demo: "",
      impact: "High Impact"
    },
    {
      name: "AI Course Planner",
      category: "Education Tool",
      status: "Planning",
      progress: 30,
      description: "A course planning tool that creates study roadmaps, topic lists, revision plans and weekly learning goals.",
      tech: "HTML, CSS, JavaScript",
      repo: "",
      demo: "",
      impact: "High Impact"
    },
    {
      name: "Client Website Checklist",
      category: "Web Development",
      status: "Planning",
      progress: 45,
      description: "A website delivery checklist for checking pages, links, mobile view, SEO, forms, content and launch readiness.",
      tech: "HTML, CSS, JavaScript",
      repo: "",
      demo: "",
      impact: "Medium Impact"
    }
  ];

  const selected = ideas[Math.floor(Math.random() * ideas.length)];
  selected.id = createId("p");

  data.projects.unshift(selected);
  saveData();
  renderAll();
}

function generateReadme() {
  const name = $("readmeName").value.trim() || "Developer";
  const role = $("readmeRole").value.trim() || "Web Developer";
  const bio = $("readmeBio").value.trim();
  const focus = $("readmeFocus").value.trim();

  const topProjects = [...data.projects]
    .sort((a, b) => Number(b.progress) - Number(a.progress))
    .slice(0, 5);

  const topSkills = [...data.skills]
    .sort((a, b) => Number(b.level) - Number(a.level))
    .slice(0, 8);

  const projectMarkdown = topProjects
    .map((project) => {
      const repoText = project.repo ? ` | [Repository](${project.repo})` : "";
      const demoText = project.demo ? ` | [Live Demo](${project.demo})` : "";

      return `- ${project.name} — ${project.description}${repoText}${demoText}`;
    })
    .join("\n");

  const skillMarkdown = topSkills
    .map((skill) => `- ${skill.name} (${skill.category}) — ${skill.level}%`)
    .join("\n");

  const readme = `# Hi, I am ${name}

## About Me

I am a ${role}.

${bio}

## Current Focus

${focus}

## Featured Projects

${projectMarkdown || "- More projects coming soon."}

## Skills

${skillMarkdown || "- More skills coming soon."}

## GitHub Portfolio Goals

- Build complete and useful projects
- Improve README documentation
- Add screenshots and live demo links
- Create clean and consistent commits
- Keep improving project quality step by step

## Contact

Feel free to connect with me through GitHub.

---

Generated using DevShowcase Studio.
`;

  $("readmeOutput").value = readme;
}

function copyText(value) {
  if (!value.trim()) {
    alert("Nothing to copy yet.");
    return;
  }

  if (navigator.clipboard) {
    navigator.clipboard.writeText(value).then(() => {
      alert("Copied successfully.");
    });
  } else {
    const temp = document.createElement("textarea");
    temp.value = value;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand("copy");
    document.body.removeChild(temp);
    alert("Copied successfully.");
  }
}

$("projectForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const project = {
    id: createId("p"),
    name: $("projectName").value.trim(),
    category: $("projectCategory").value,
    status: $("projectStatus").value,
    progress: Number($("projectProgress").value),
    description: $("projectDescription").value.trim(),
    tech: $("projectTech").value.trim(),
    repo: $("projectRepo").value.trim(),
    demo: $("projectDemo").value.trim(),
    impact: $("projectImpact").value
  };

  data.projects.unshift(project);
  saveData();

  event.target.reset();
  $("projectProgress").value = 70;

  renderAll();
});

$("skillForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const skill = {
    id: createId("s"),
    name: $("skillName").value.trim(),
    category: $("skillCategory").value,
    level: Number($("skillLevel").value)
  };

  data.skills.unshift(skill);
  saveData();

  $("skillName").value = "";
  $("skillCategory").value = "Frontend";
  $("skillLevel").value = 70;

  renderAll();
});

$("taskForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const task = {
    id: createId("t"),
    title: $("taskTitle").value.trim(),
    priority: $("taskPriority").value,
    stage: $("taskStage").value
  };

  data.tasks.unshift(task);
  saveData();

  $("taskTitle").value = "";
  $("taskPriority").value = "High";
  $("taskStage").value = "todo";

  renderAll();
});

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");

  if (!button) return;

  const action = button.dataset.action;
  const id = button.dataset.id;

  if (action === "deleteProject") {
    data.projects = data.projects.filter((project) => project.id !== id);
    saveData();
    renderAll();
  }

  if (action === "increaseProject") {
    const project = data.projects.find((item) => item.id === id);

    if (project) {
      project.progress = Math.min(100, Number(project.progress) + 5);

      if (project.progress === 100) {
        project.status = "Completed";
      }

      saveData();
      renderAll();
    }
  }

  if (action === "deleteSkill") {
    data.skills = data.skills.filter((skill) => skill.id !== id);
    saveData();
    renderAll();
  }

  if (action === "increaseSkill") {
    const skill = data.skills.find((item) => item.id === id);

    if (skill) {
      skill.level = Math.min(100, Number(skill.level) + 5);
      saveData();
      renderAll();
    }
  }

  if (action === "deleteTask") {
    data.tasks = data.tasks.filter((task) => task.id !== id);
    saveData();
    renderAll();
  }

  if (action === "moveTask") {
    const task = data.tasks.find((item) => item.id === id);

    if (task) {
      task.stage = button.dataset.stage;
      saveData();
      renderAll();
    }
  }
});

$("projectSearch").addEventListener("input", renderProjects);
$("projectFilter").addEventListener("change", renderProjects);

$("sampleProjectBtn").addEventListener("click", generateSampleProject);

$("generateReadmeBtn").addEventListener("click", generateReadme);

$("copyReadmeBtn").addEventListener("click", () => {
  copyText($("readmeOutput").value);
});

generateReadme();
renderAll();
