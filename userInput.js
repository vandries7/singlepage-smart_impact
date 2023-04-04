function UserInput() {
    console.log('UserInput module loaded!');

    let username = '';
    let user = {};
    let gists = [];

    const handleSubmit = (event) => {
        event.preventDefault();
        jQuery.get(`https://api.github.com/users/${username}`, function(response) {
            user = response;
            jQuery.get(`https://api.github.com/users/${username}/gists`, function(gistsResponse) {
                gists = gistsResponse;
                render();
            });
        });
    };

    const render = () => {
        jQuery('body').append(`
      <form>
        <input type="text" placeholder="Enter Github username" value="${username}" />
        <button type="submit">Submit</button>
      </form>
    `);
        jQuery('form').submit(handleSubmit);
        if (user) {
            jQuery('body').append(`
        <div>
          <img alt="" src="${user.avatar_url}" />
          <h2>${user.name}</h2>
          <p>${user.bio}</p>
        </div>
      `);
        }
        if (gists.length > 0) {
            jQuery('body').append(`
        <ul>
          ${gists.map(gist => `
            <li>
              <h3>${gist.description}</h3>
              <p>${new Date(gist.created_at).toLocaleDateString()}</p>
              <span class="badge">${Object.keys(gist.files)[0].split('.').pop()}</span>
              <ul>
                ${gist.forks.map(fork => `
                  <li>${fork.owner.login}</li>
                `).join('')}
              </ul>
            </li>
          `).join('')}
        </ul>
      `);
            jQuery('li').click(function() {
                const gist = gists[$(this).index()];
                jQuery('body').append(`
          <pre><code class="language-${Object.keys(gist.files)[0].split('.').pop()}">${gist.files[Object.keys(gist.files)[0]].content}</code></pre>
        `);
                Prism.highlightAll();
            });
        }
    };

    return {
        render: render
    };
}

export default UserInput;
