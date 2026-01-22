<div align="center">
  <img src="public/screenshots/landing.png" width="100%" alt="Bloglet Banner" />
  
  <br />
  <br />

  <h1>Bloglet.</h1>
  <p>
    <strong>"The noise stops here."</strong>
    <br />
    A minimalist, distraction-free blogging platform built for developers who write.
  </p>

  <p>
    <a href="https://nextjs.org">
      <img src="https://img.shields.io/badge/Next.js%2014-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
    </a>
    <a href="https://supabase.com">
      <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
    </a>
    <a href="https://tailwindcss.com">
      <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    </a>
    <a href="https://cloudinary.com">
      <img src="https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" alt="Cloudinary" />
    </a>
    <a href="https://www.typescriptlang.org">
      <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    </a>
  </p>

  <br />
</div>

<hr />

<h2>✨ Overview</h2>
<p>
  <strong>Bloglet</strong> is a modern, full-stack blogging application designed with an "Ethereal Tech" aesthetic. It strips away the clutter of traditional CMS platforms, offering a hyper-minimalist environment where the writing experience is paramount.
</p>
<p>
  Under the hood, it leverages the power of <strong>Next.js 14 (Server Actions)</strong> and <strong>Supabase</strong> to deliver instant page loads, robust authentication, and a seamless writing flow.
</p>

<h2>🚀 Key Features</h2>
<table>
  <tr>
    <td width="50%">
      <h3>🤖 Interactive Mascot</h3>
      <p>A custom SVG mascot ('Blogo') that tracks your cursor in real-time and covers its eyes when you type a password. A delightful UX detail.</p>
    </td>
    <td width="50%">
       <h3>🌗 Dynamic Theming</h3>
       <p>Built from the ground up with <strong>Tailwind CSS</strong> to support seamless switching between Dark ("Ethereal") and Light modes.</p>
    </td>
  </tr>
  <tr>
    <td>
      <h3>🔐 Robust Auth</h3>
      <p>Secure authentication via GitHub OAuth and Email/Password, protected by Supabase RLS (Row Level Security) policies.</p>
    </td>
    <td>
      <h3>✍️ The "Flow" Editor</h3>
      <p>A distraction-free Markdown editor with live preview, designed to keep you in the writing zone.</p>
    </td>
  </tr>
  <tr>
    <td>
      <h3>🎨 Identity System</h3>
      <p>Auto-generated, collision-proof usernames (<code>user_x9z2p1</code>) that users can customize in their profile settings.</p>
    </td>
    <td>
      <h3>🔍 Instant Search</h3>
      <p>Real-time search functionality to discover stories, topics, and authors instantly.</p>
    </td>
  </tr>
</table>

<br />

<h2>📸 Gallery</h2>

<h3>The User Experience</h3>
<p><em>Desktop View: Dark Mode</em></p>
<table>
  <tr>
    <td width="50%" align="center">
      <strong>Secure Login with Mascot</strong>
      <br /><br />
      <img src="public/screenshots/auth.png" width="100%" alt="Auth Screen" />
    </td>
    <td width="50%" align="center">
      <strong>Profile & Customization</strong>
      <br /><br />
      <img src="public/screenshots/profile.png" width="100%" alt="Profile Screen" />
    </td>
  </tr>
</table>

<h3>The Creative Space</h3>
<p><em>Desktop View: Dark Mode</em></p>
<div align="center">
  <img src="public/screenshots/editor.png" width="100%" alt="Markdown Editor" />
</div>

<br />

<h3>Mobile & Discovery</h3>
<p><em>Mobile View: Light Mode</em></p>
<table>
  <tr>
    <td width="50%" align="center">
      <strong>Dashboard & Stories</strong>
      <br /><br />
      <img src="public/screenshots/dashboard.png" width="100%" alt="Mobile Dashboard" />
    </td>
    <td width="50%" align="center">
      <strong>Search Interface</strong>
      <br /><br />
      <img src="public/screenshots/search.png" width="100%" alt="Mobile Search" />
    </td>
  </tr>
</table>

<br />
<hr />

<h2>🏃‍♂️ Getting Started</h2>
<p>Want to run this locally? Follow these steps:</p>

<h3>1. Clone the repository</h3>
<pre><code>git clone https://github.com/CaSh007s/bloglet.git
cd bloglet</code></pre>

<h3>2. Install Dependencies</h3>
<pre><code>npm install
# or
yarn install</code></pre>

<h3>3. Environment Setup</h3>
<p>Create a <code>.env.local</code> file in the root directory and add your keys:</p>
<pre><code>NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_SITE_URL=http://localhost:3000</code></pre>

<h3>4. Run the Development Server</h3>
<pre><code>npm run dev</code></pre>
<p>Open <a href="http://localhost:3000">http://localhost:3000</a> with your browser to see the result.</p>

<hr />

<div align="center">
  <p>
    Built with ❤️ by <a href="https://github.com/CaSh007s"><strong>CaSh007s</strong></a>
  </p>
  <p>
    <a href="LICENSE">MIT License</a>
  </p>
</div>
