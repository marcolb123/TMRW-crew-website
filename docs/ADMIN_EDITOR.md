# Editing TMRW Crew with Pages CMS

The public website stays HTML, CSS and vanilla JavaScript. The admin dashboard is
hosted separately by [Pages CMS](https://app.pagescms.org). You sign in using
GitHub; visitors do not need accounts. You do not need to provision a database,
create a website password, run a local CMS, or put API keys in this repository.

The `.pages.yml` file in the repository root tells Pages CMS how to edit the two
existing JSON files. It offers **News and archived events**, **Videos and photos**,
and an image upload browser. It does not add an admin login to the public site.

## One-time setup — do these on your side

1. Open [app.pagescms.org](https://app.pagescms.org) and choose **Sign in with
   GitHub**. Use the GitHub account that can edit `marcolb123/TMRW-crew-website`.
2. Follow the prompt to install/configure the **Pages CMS GitHub App**. On GitHub,
   choose **Only select repositories**, then select **TMRW-crew-website**. Confirm
   the app permissions. The app needs repository access to save content and uploads.
3. Return to Pages CMS. Refresh the repository list if necessary, then select
   **marcolb123 → TMRW-crew-website → main**. The configuration must be on the branch
   you select. `feature/github-content-editor` is also available for a rehearsal;
   changes saved there do not affect a production deployment that uses `main`.
4. The dashboard should show **News and archived events** and **Videos and photos**.
   Open each and check that your existing seven event/class records and eight
   media records appear. Expand a row to edit it. If you see a request to create a
   configuration instead, check the repository/branch selection and `.pages.yml`.
5. Check your existing hosting service. It must deploy this repository's **main**
   branch and serve the repository root. Keep the site's existing build/publish
   settings; no new application build is needed. If deployments are manual, enable
   the host's Git integration/automatic deployments. CMS saves commit to GitHub;
   they do not independently deploy a website.
6. Bookmark the Pages CMS dashboard. You can now publish through the form rather
   than editing HTML or writing JSON manually.

The GitHub sign-in and app installation require your account authorisation and
cannot be completed by adding repository configuration alone. No personal access
token or secret value needs to be sent in chat or copied into the website.

## Add or edit an event/class

1. Open **News and archived events**. Expand a row to edit, or use the list's add
   control to create a new entry. The exact button wording may vary by CMS version.
2. Enter a **unique ID** using lowercase letters/numbers and hyphens, plus the
   title and category. Keep existing IDs unchanged to preserve direct event links.
3. Keep **Published** off while drafting. Turn it on when the content is ready.
   Existing records without this property are treated as published.
4. Enter location, description paragraphs and schedule lines. Use one schedule
   line per local day/time/location. Unknown dates stay blank. Date fields store
   UK calendar dates as `YYYY-MM-DD`; time details stay in the schedule lines.
5. For a regular class, enable **Regular / recurring class**. For previous work,
   enable **Show in archive**. The archive stays one collection without category
   filters. Newly added entries appear first. Past dated/completed events also go there.
6. In **Poster / cover → Image**, upload or select the poster. Add an image
   description. Uploads default to `uploads/`; existing optimized assets are also
   selectable. Clear optional width/height values if replacing an image of a
   different size, or enter the new actual pixel dimensions.
7. Add only known booking/social links. Each link has its own button label and URL.
   The optional archive gallery, YouTube/Instagram links and participants can be
   filled in too. Keep review notes where information is still uncertain.
8. Save the form. This commits the JSON to the branch selected in Pages CMS.
   Saving on `main` makes the content available to your automatic deployment.
   Check the deployment finishes, then refresh News/Archive to see the result.

New list entries are appended in JSON and displayed first on the website. If you
reorder entries with the move/drag controls, the last JSON entry appears first.
Unpublished entries remain in
JSON but are not shown on News or Archive. There is no public draft-preview mode.
Avoid editing the same JSON file in two browser tabs or editors at once; reload
and review any conflict rather than overwriting someone else's save.

## Add a photo

1. Open **Videos and photos**, then add a gallery item.
2. Supply a unique ID and a meaningful title/photo description.
3. Set **Media type → Photo** and **Source → Uploaded photo**.
4. Choose/upload the photo in **Photo / video thumbnail**. You can leave
   **Original photo path or video URL** blank: the site uses the uploaded image.
   To keep a separate full-resolution original, put that file's repository path
   in the original-photo field and choose its lightweight preview as the image.
5. Set Published as appropriate, then Save. Photos join the existing slideshow;
   the page remains just **Videos** and **Photos**, without sorting/filter controls.

Prefer WebP images with about 1600 pixels on the longest edge and under 500 KB.
The CMS uploads files as supplied; this configuration does **not** automatically
compress new uploads. Existing image optimisation and slideshow preloading remain
in place. For many large original photos, a dedicated image service can be added
later; it is not required for this setup.

## Add a video

1. Add a gallery item, supply ID/title, set **Media type → Video**, and choose
   **Google Drive**, **YouTube**, or **Instagram** as the source.
2. Paste the full video URL in **Original photo path or video URL**:
   - Google Drive: `https://drive.google.com/file/d/VIDEO_ID/view`.
   - YouTube: a `youtube.com/watch?v=...`, `youtube.com/shorts/...`, or `youtu.be/...`
     link, including `https://`.
   - Instagram: the full `https://www.instagram.com/reel/.../` or post URL.
3. Select/upload a thumbnail, set Published, and Save. For Google Drive, ensure
   visitors have permission to view the file. Google Drive/YouTube load only when
   Play is pressed; Instagram remains an external link.

## Archive, hide, delete and recover

- **Archive:** switch on Show in archive for an event and Save. This keeps its
  history available publicly. Workshop posters remain in the existing archive gallery.
- **Unpublish:** switch off Published and Save. The item stays editable but is
  hidden publicly, including in the archive. It is not a privacy control: content
  in a public GitHub repository remains publicly readable.
- **Delete:** remove a row from the event/media list, then Save. The row is removed
  from JSON, not from Git history. Archiving is preferable for historical events.
  The CMS is configured to protect the JSON files themselves from file deletion;
  individual list rows can still be removed.
- **Images:** deleting a row does not automatically delete its uploaded files.
  Do not remove an image still referenced by other content or the site's styles.
- **Recover:** open the affected JSON file on GitHub, use History to find a known
  good revision, and restore its contents with a new commit. The same applies to
  deleted images. Reload the CMS after restoring.

## Checks and troubleshooting

A GitHub Actions workflow named **Content checks** runs the dependency-free checks
when relevant content changes. It checks JSON/schema rules, duplicate IDs and
referenced local files. These checks run **after** a CMS save; they do not block
that save or guarantee your hosting provider waits before deploying. Use a branch
for a rehearsal if you want to inspect a change before it reaches production.

If a CMS save succeeds but the site is unchanged, confirm the selected branch,
GitHub commit, host deployment status and browser refresh. If a content check
fails, inspect its message, fix the record in the CMS and save again. Do not reuse
IDs, invent unknown dates, choose a video provider for a photo, or paste a video
URL without `https://`.

Run locally with `python3 -m http.server 8000 --bind 127.0.0.1` and
`node --test tests/*.test.cjs` for browser/data checks. These tools are only for
development; the deployed site remains static.

## Validation of this integration

The configuration was checked against the upstream Pages CMS configuration schema
at source revision `6f4e860a35d934406580287e7042e5e111e207a1`, and all existing JSON
properties are represented so an editor save does not silently drop legacy fields.
Round-trip checks using upstream form defaults, validation, field writers and
sanitisation preserved existing records and accepted new draft/photo fixtures.
Local tests cover omitted optional fields/lists, empty collections, draft hiding,
photo upload paths, date validation and existing page behaviour. The authenticated
hosted dashboard, app installation, GitHub Actions execution and production deploy
must be confirmed after you connect your account; local tests cannot establish them.
