import { Octokit } from "https://cdn.skypack.dev/@octokit/core";

function UserInput() {


    let username = "";
    let user = {};
    let gists = [];

    const octokit = new Octokit({
        //ADD YOUR KEY HERE
        auth: "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",
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        username = event.target[0].value;
        user = await octokit.request("GET /users/{username}", {
            username,
        });

        gists = await octokit.request('GET /users/{username}/gists', {
            username: username ,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        })

        console.log(gists);
        render();
    };

    jQuery("body").append(`
      <form class="custom-search">
        <input type="text" class="custom-search-input" placeholder="Introdu username" value="${username}" />
        <button type="submit" class="custom-search-botton">Cauta</button>
      </form>
    `);

    const render = () => {

        jQuery("form").submit(handleSubmit);
        if (user.data) {
            jQuery("#user-input").html(`
        <div>
          <img alt="${user.data.name}" src="${user.data.avatar_url}" />
          <h2>${user.data.name}</h2>
          <p>${user.data.bio}</p>
        </div>
      `);
        }
        if (gists.status === 200) {
            jQuery("#user-gists").append(`
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
               ${gist.forks && gist.forks.map((fork) => `
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
                    });
            });
        }
    };

    return {
        render: render,
    };
}

export default UserInput;
