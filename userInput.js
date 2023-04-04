import { Octokit } from "https://cdn.skypack.dev/@octokit/core";

function UserInput() {
    console.log("UserInput module loaded!");

    let username = "";
    let user = {};
    let gists = [];

    const octokit = new Octokit({
        auth: "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",
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        username = event.target[0].value;
        user = await octokit.request("GET /users/{username}", {
            username,
        });
        gists = await octokit.request("GET /users/{username}/gists", {
            username,
        });
        render();
    };

    const render = () => {
        jQuery("body").append(`
      <form>
        <input type="text" placeholder="Enter Github username" value="${username}" />
        <button type="submit">Submit</button>
      </form>
    `);
        jQuery("form").submit(handleSubmit);
        if (user.data) {
            jQuery("body").append(`
        <div>
          <img alt="" src="${user.data.avatar_url}" />
          <h2>${user.data.name}</h2>
          <p>${user.data.bio}</p>
        </div>
      `);
        }
        if (gists.data.length > 0) {
            jQuery("body").append(`
        <ul>
          ${gists.data
                .map(
                    (gist) => `
            <li>
              <h3>${gist.description}</h3>
              <p>${new Date(gist.created_at).toLocaleDateString()}</p>
              <span class="badge">${
                        Object.keys(gist.files)[0].split(".").pop()
                    }</span>
              <ul>
                ${gist.forks.map((fork) => `
                  <li>${fork.owner.login}</li>
                `).join('')}
              </ul>
            </li>
          `
                )
                .join("")}
        </ul>
      `);
            jQuery("li").click(function () {
                const gist = gists.data[$(this).index()];
                octokit
                    .request("GET /gists/{gist_id}", {
                        gist_id: gist.id,
                        headers: {
                            "X-GitHub-Api-Version": "2022-11-28",
                        },
                    })
                    .then((response) => {
                        jQuery("body").append(`
          <pre><code class="language-${
                            Object.keys(response.data.files)[0].split(".").pop()
                        }">${response.data.files[Object.keys(response.data.files)[0]].content}</code></pre>
        `);
                        Prism.highlightAll();
                    });
            });
        }
    };

    return {
        render: render,
    };
}

export default UserInput;
