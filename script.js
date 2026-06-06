const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const copyText = async (text) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }
  return false;
};

document.querySelectorAll("[data-copy-email]").forEach((button) => {
  const originalText = button.textContent;

  button.addEventListener("click", async () => {
    const email = button.getAttribute("data-copy-email");

    try {
      await copyText(email);
      button.textContent = "Copied";
      window.setTimeout(() => {
        button.textContent = originalText;
      }, 1600);
    } catch {
      button.textContent = email;
    }
  });
});

const setupNotebookFilters = () => {
  const search = document.querySelector("[data-notebook-search]");
  const grid = document.querySelector("[data-card-grid]");
  const buttons = document.querySelectorAll("[data-filter-type]");

  if (!search || !grid || buttons.length === 0) return;

  let activeType = "all";
  const cards = [...grid.querySelectorAll("[data-card]")];

  const applyFilter = () => {
    const query = search.value.trim().toLowerCase();

    cards.forEach((card) => {
      const typeMatches = activeType === "all" || card.dataset.type === activeType;
      const haystack = [
        card.dataset.title,
        card.dataset.tags,
        card.textContent,
      ].join(" ").toLowerCase();
      const queryMatches = !query || haystack.includes(query);
      card.hidden = !(typeMatches && queryMatches);
    });
  };

  search.addEventListener("input", applyFilter);

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      activeType = button.dataset.filterType;
      buttons.forEach((item) => item.classList.toggle("active", item === button));
      applyFilter();
    });
  });
};

const sampleResume = {
  name: "Kennedy Mosoti",
  headline: "Observability Platform Engineer - Infrastructure Automation - AI Tooling Experiments",
  contact: {
    location: "Dallas-Fort Worth, TX",
    email: "kennedy.rmosoti@gmail.com",
    github: "github.com/kmosoti",
  },
  summary:
    "I work near Splunk, Logstash, SaltStack, Linux, RCA, remediation, and DR readiness. I like tools that turn operational fog into inspectable state.",
  skills: [
    "Splunk Enterprise",
    "Logstash",
    "Kafka ingestion workflows",
    "SaltStack",
    "Python",
    "Linux",
    "Terraform",
    "AWS",
  ],
  experience: [
    {
      role: "Associate Observability Engineer",
      company: "Netbuilder / JPMC LogA Platform Contractor",
      period: "Aug 2024 - Present",
      bullets: [
        "Automated search-filter updates across 3,000+ Splunk roles.",
        "Supported Salt-based Splunk automation across 100+ search heads.",
        "Worked around Kafka, Logstash, Splunk ingestion paths, stale topic cleanup, and remediation.",
        "Investigated DR readiness gaps around cluster-manager and deployer workflows.",
      ],
    },
  ],
  projects: [
    {
      name: "resume-builder",
      description:
        "A structured resume generator where portable source data renders into inspectable output.",
    },
    {
      name: "tea-style",
      description:
        "A doctrine scaffold for reusable engineering principles, patterns, notes, and experiments.",
    },
  ],
  education: [
    {
      school: "University of Texas at Arlington",
      credential: "B.S. Software Engineering",
    },
  ],
};

const requiredResumeFields = [
  ["name", "string"],
  ["headline", "string"],
  ["contact", "object"],
  ["summary", "string"],
  ["skills", "array"],
  ["experience", "array"],
  ["projects", "array"],
  ["education", "array"],
];

const validateResume = (data) => {
  const errors = [];

  requiredResumeFields.forEach(([field, type]) => {
    const value = data?.[field];
    if (value === undefined || value === null) {
      errors.push(`Missing required field: ${field}`);
      return;
    }
    if (type === "array" && !Array.isArray(value)) {
      errors.push(`${field} must be an array`);
    }
    if (type === "object" && (typeof value !== "object" || Array.isArray(value))) {
      errors.push(`${field} must be an object`);
    }
    if (type === "string" && typeof value !== "string") {
      errors.push(`${field} must be a string`);
    }
  });

  if (data?.experience && Array.isArray(data.experience)) {
    data.experience.forEach((item, index) => {
      ["role", "company", "period", "bullets"].forEach((field) => {
        if (!(field in item)) errors.push(`experience[${index}] missing ${field}`);
      });
      if (item.bullets && !Array.isArray(item.bullets)) {
        errors.push(`experience[${index}].bullets must be an array`);
      }
    });
  }

  return errors;
};

const renderResume = (data) => {
  const contact = data.contact || {};
  const skills = (data.skills || []).map((skill) => `<li>${escapeHtml(skill)}</li>`).join("");
  const experience = (data.experience || [])
    .map(
      (item) => `
        <section>
          <h3>${escapeHtml(item.role)} - ${escapeHtml(item.company)}</h3>
          <p>${escapeHtml(item.period)}</p>
          <ul>${(item.bullets || []).map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join("")}</ul>
        </section>
      `
    )
    .join("");
  const projects = (data.projects || [])
    .map(
      (project) => `
        <section>
          <h3>${escapeHtml(project.name)}</h3>
          <p>${escapeHtml(project.description)}</p>
        </section>
      `
    )
    .join("");
  const education = (data.education || [])
    .map(
      (item) => `
        <section>
          <h3>${escapeHtml(item.credential)}</h3>
          <p>${escapeHtml(item.school)}</p>
        </section>
      `
    )
    .join("");

  return `
    <article>
      <header>
        <h1>${escapeHtml(data.name)}</h1>
        <p><strong>${escapeHtml(data.headline)}</strong></p>
        <p>${escapeHtml(contact.location || "")} - ${escapeHtml(contact.email || "")} - ${escapeHtml(contact.github || "")}</p>
      </header>
      <section>
        <h2>Summary</h2>
        <p>${escapeHtml(data.summary)}</p>
      </section>
      <section>
        <h2>Skills</h2>
        <ul>${skills}</ul>
      </section>
      <section>
        <h2>Experience</h2>
        ${experience}
      </section>
      <section>
        <h2>Projects</h2>
        ${projects}
      </section>
      <section>
        <h2>Education</h2>
        ${education}
      </section>
    </article>
  `;
};

const downloadFile = (filename, content, type) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const setupResumeSandbox = () => {
  const root = document.querySelector("[data-resume-sandbox]");
  if (!root) return;

  const editor = root.querySelector("[data-resume-json]");
  const preview = root.querySelector("[data-resume-preview]");
  const validationTitle = root.querySelector("[data-validation-title]");
  const validationOutput = root.querySelector("[data-validation-output]");
  const renderState = root.querySelector("[data-render-state]");
  const resetButton = root.querySelector("[data-reset-resume]");
  const copyButton = root.querySelector("[data-copy-resume-json]");
  const downloadButton = root.querySelector("[data-download-resume-html]");

  let latestHtml = "";

  const setSample = () => {
    editor.value = JSON.stringify(sampleResume, null, 2);
  };

  const update = () => {
    try {
      const data = JSON.parse(editor.value);
      const errors = validateResume(data);

      if (errors.length > 0) {
        validationTitle.textContent = "Invalid structure";
        validationOutput.textContent = errors.join("\n");
        renderState.textContent = "blocked";
        preview.innerHTML = "<p>Fix validation errors before rendering.</p>";
        latestHtml = "";
        return;
      }

      latestHtml = renderResume(data);
      preview.innerHTML = latestHtml;
      validationTitle.textContent = "Valid resume data";
      validationOutput.textContent = "Schema checks passed. Preview rendered from structured JSON.";
      renderState.textContent = "rendered";
    } catch (error) {
      validationTitle.textContent = "Invalid JSON";
      validationOutput.textContent = error.message;
      renderState.textContent = "blocked";
      preview.innerHTML = "<p>Fix JSON syntax before rendering.</p>";
      latestHtml = "";
    }
  };

  editor.addEventListener("input", update);
  resetButton.addEventListener("click", () => {
    setSample();
    update();
  });
  copyButton.addEventListener("click", async () => {
    try {
      await copyText(editor.value);
      copyButton.textContent = "Copied";
      window.setTimeout(() => {
        copyButton.textContent = "Copy JSON";
      }, 1400);
    } catch {
      validationOutput.textContent = "Clipboard write failed. Select the JSON manually.";
    }
  });
  downloadButton.addEventListener("click", () => {
    if (!latestHtml) {
      validationOutput.textContent = "Nothing to export. Fix validation errors first.";
      return;
    }
    downloadFile("resume-preview.html", `<!doctype html><html><body>${latestHtml}</body></html>`, "text/html");
  });

  setSample();
  update();
};

setupNotebookFilters();
setupResumeSandbox();
