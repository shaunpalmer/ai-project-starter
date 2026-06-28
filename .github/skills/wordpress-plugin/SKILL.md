# SKILL: WordPress Plugin

## Purpose

Build a well-structured, maintainable WordPress plugin following Shaun's conventions:

* WordPress hooks at the edge
* A thin root plugin file
* A clear bootstrap/main plugin class
* Classes for structure and business logic
* Repositories for database access
* Services for orchestration
* Adapters for external APIs
* Admin UX on top
* Custom tables underneath only when needed

The goal is not clever code.

The goal is a plugin Shaun can read, maintain, extend, debug, and safely install six months later.

---

## When to Use

Load this skill when the project type is `WordPress plugin`.

Use it for:

* Building a new WordPress plugin from scratch
* Adding a major new module to an existing plugin
* Reviewing a WordPress plugin for structure and convention compliance
* Planning plugin architecture before coding
* Refactoring a plugin that has become messy
* Adding admin pages, shortcodes, REST routes, AJAX handlers, custom tables, cron jobs, or external API integrations

---

## Inputs Required

Before code begins, the agent must know or ask for:

* [ ] Plugin name and purpose
* [ ] Plugin slug
* [ ] Text domain
* [ ] Main plugin file name
* [ ] Minimum WordPress version
* [ ] Minimum PHP version
* [ ] Admin-only, frontend-only, or both
* [ ] Does it need custom database tables?
* [ ] Does it use existing WordPress data such as posts, post meta, users, options, or terms?
* [ ] Does it add an admin page?
* [ ] Does it need a frontend shortcode, widget, block, or template?
* [ ] Does it need REST routes?
* [ ] Does it need AJAX actions?
* [ ] Does it need cron jobs?
* [ ] Does it connect to external APIs?
* [ ] Does it enqueue CSS or JavaScript?
* [ ] Does it need activation, deactivation, or uninstall behavior?
* [ ] What is the first useful build slice?

If any required input is unknown and relevant, ask Shaun before coding.

---

## Core Plugin Rule

A WordPress plugin must be built around:

1. WordPress conventions first
2. Shaun's architecture rules second
3. Project-specific needs third

Do not invent infrastructure when WordPress already provides the correct API.

Do not bypass WordPress APIs with hardcoded paths, URLs, admin links, SQL, or raw request handling.

Build WordPress plugins the WordPress way.

---

## Required Plugin Shape

Every plugin must have:

* A root plugin folder
* A main plugin file in the root folder
* A valid WordPress plugin header comment at the top of the main plugin file
* A direct-access guard
* Defined plugin constants
* A bootstrap file or main plugin class
* A clear folder structure
* Assets loaded through WordPress enqueue functions
* Activation handling where needed
* Deactivation handling where needed
* Uninstall handling where needed
* Security rules for input, output, permissions, nonces, and database queries

The root plugin file should stay thin.

Do not put business logic, admin rendering, SQL, REST routes, AJAX handlers, or large functions in the root plugin file.

The root file boots the plugin.

The plugin classes do the work.

---

## Approved Folder Structures

Choose one structure in `ARCHITECTURE.md` before coding.

Do not mix folder structures halfway through a plugin.

### Option A — Shaun Default WordPress Plugin Structure

Use this for most practical WordPress plugins, especially plugins that do not need Composer or heavy build tooling.

```text
/plugin-name/
├── plugin-name.php              ← plugin header, constants, bootstrap loader
├── readme.txt                   ← WordPress.org format readme if needed
├── changelog.txt                ← version history
├── uninstall.php                ← deliberate uninstall behavior if needed
│
├── /assets/
│   ├── /css/
│   │   ├── admin.css
│   │   └── public.css
│   ├── /js/
│   │   ├── admin.js
│   │   └── public.js
│   └── /img/
│
├── /includes/
│   ├── class-plugin.php         ← main class: loads modules and registers hooks
│   ├── class-activator.php      ← activation: tables, defaults, rewrite flush
│   └── class-deactivator.php    ← deactivation: cleanup, rewrite flush
│
├── /admin/
│   ├── class-admin.php          ← menus, admin assets, admin actions
│   └── /views/                  ← admin PHP templates
│       ├── page-settings.php
│       ├── page-dashboard.php
│       └── page-logs.php
│
├── /frontend/
│   └── class-frontend.php       ← shortcodes, public assets, frontend output
│
├── /database/
│   ├── class-installer.php      ← dbDelta tables and versioned upgrades
│   └── class-repository.php     ← all database queries live here
│
├── /services/
│   ├── class-[name]-service.php ← business logic and orchestration
│   └── class-export-service.php ← export logic
│
├── /adapters/
│   └── class-[api]-adapter.php  ← one file per external API or service
│
├── /strategies/
│   └── class-[name]-strategy.php ← swappable logic
│
├── /support/
│   └── class-[name]-helper.php  ← small shared helpers
│
├── /templates/
│   └── [name].php               ← frontend output templates
│
├── /tests/
└── /docs/
```

### Option B — Scalable OOP / Composer Structure

Use this when the plugin benefits from namespaces, Composer autoloading, stronger separation, or future scale.

```text
plugin-slug/
├── plugin-slug.php
├── README.md
├── readme.txt
├── changelog.txt
├── composer.json
├── package.json
├── uninstall.php
│
├── assets/
│   ├── css/
│   │   ├── admin.css
│   │   └── public.css
│   ├── js/
│   │   ├── admin.js
│   │   └── public.js
│   └── img/
│
├── build/
│   └── ...
│
├── config/
│   └── plugin.php
│
├── languages/
│
├── resources/
│   ├── views/
│   └── templates/
│
├── src/
│   ├── Plugin.php
│   ├── Admin/
│   ├── Frontend/
│   ├── Assets/
│   ├── Database/
│   ├── Repositories/
│   ├── Services/
│   ├── Adapters/
│   ├── Rest/
│   ├── Ajax/
│   ├── Cron/
│   ├── Support/
│   └── Contracts/
│
├── tests/
└── docs/
```

### Structure Rule

For Shaun's projects, prefer Option A unless there is a clear reason to use Option B.

Use Option B when:

* Composer autoloading is justified
* Namespaces make the plugin easier to maintain
* The plugin has many modules
* External dependencies need clean boundaries
* The project is likely to grow into a larger system

Record the chosen structure in `ARCHITECTURE.md`.

---

## JSON File Rules

Use JSON files only where they belong.

* `composer.json` lives in the plugin root if PHP autoloading or Composer dependencies are used.
* `package.json` lives in the plugin root if JavaScript, CSS, or asset tooling is used.
* `block.json` lives inside each block folder if the plugin includes Gutenberg blocks.
* Build manifest files may live in `build/` if generated by the asset build process.
* Project configuration may live in `config/`.
* Do not hide project logic inside random JSON files.

If the plugin does not need build tooling, do not add build tooling just to look modern.

---

## Main Plugin File Rules

The main plugin file must contain only:

* WordPress plugin header
* Direct-access guard
* Plugin constants
* Autoloader or required class files
* Activation hook
* Deactivation hook
* Boot call

Example:

```php
<?php
/**
 * Plugin Name:       Example Plugin
 * Description:       Short description of what this plugin does.
 * Version:           1.0.0
 * Requires at least: 6.0
 * Requires PHP:      8.0
 * Author:            Shaun Palmer
 * License:           GPL-2.0+
 * Text Domain:       example-plugin
 * Domain Path:       /languages
 */

defined( 'ABSPATH' ) || exit;

define( 'EXAMPLE_PLUGIN_VERSION', '1.0.0' );
define( 'EXAMPLE_PLUGIN_FILE', __FILE__ );
define( 'EXAMPLE_PLUGIN_PATH', plugin_dir_path( __FILE__ ) );
define( 'EXAMPLE_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'EXAMPLE_PLUGIN_BASENAME', plugin_basename( __FILE__ ) );

require_once EXAMPLE_PLUGIN_PATH . 'includes/class-activator.php';
require_once EXAMPLE_PLUGIN_PATH . 'includes/class-deactivator.php';
require_once EXAMPLE_PLUGIN_PATH . 'includes/class-plugin.php';

register_activation_hook( __FILE__, array( 'Example_Plugin_Activator', 'activate' ) );
register_deactivation_hook( __FILE__, array( 'Example_Plugin_Deactivator', 'deactivate' ) );

add_action( 'plugins_loaded', static function (): void {
    $plugin = new Example_Plugin();
    $plugin->run();
} );
```

Rules:

* Do not place SQL in the main plugin file.
* Do not render admin pages in the main plugin file.
* Do not register every hook manually in the main plugin file.
* Do not place business logic in the main plugin file.
* Keep the main plugin file boring, obvious, and small.

---

## Bootstrap Rules

The plugin must have a clear boot process.

Preferred flow:

1. WordPress loads the main plugin file.
2. The main plugin file defines constants.
3. The main plugin file loads the autoloader or required class files.
4. Activation and deactivation hooks are registered.
5. The plugin boots on `plugins_loaded`.
6. The main plugin class registers hooks.
7. Services, admin screens, REST routes, AJAX handlers, assets, cron tasks, and repositories are loaded from their own classes.

The bootloader must not become a junk drawer.

---

## Main Class Rules

The main plugin class loads modules and wires up hooks.

It must not contain business logic.

Example:

```php
<?php

defined( 'ABSPATH' ) || exit;

/**
 * Main plugin bootstrap class.
 */
class Example_Plugin {

    /**
     * Boot the plugin.
     *
     * @return void
     */
    public function run(): void {
        $this->load_dependencies();
        $this->define_admin_hooks();
        $this->define_public_hooks();
    }

    /**
     * Load required class files.
     *
     * @return void
     */
    private function load_dependencies(): void {
        require_once EXAMPLE_PLUGIN_PATH . 'database/class-installer.php';
        require_once EXAMPLE_PLUGIN_PATH . 'database/class-repository.php';
        require_once EXAMPLE_PLUGIN_PATH . 'services/class-tracking-service.php';
        require_once EXAMPLE_PLUGIN_PATH . 'admin/class-admin.php';
        require_once EXAMPLE_PLUGIN_PATH . 'frontend/class-frontend.php';
    }

    /**
     * Register admin hooks.
     *
     * @return void
     */
    private function define_admin_hooks(): void {
        $admin = new Example_Plugin_Admin();

        add_action( 'admin_menu', array( $admin, 'add_menu_pages' ) );
        add_action( 'admin_enqueue_scripts', array( $admin, 'enqueue_assets' ) );
    }

    /**
     * Register public hooks.
     *
     * @return void
     */
    private function define_public_hooks(): void {
        $frontend = new Example_Plugin_Frontend();

        add_shortcode( 'example_plugin', array( $frontend, 'render_shortcode' ) );
        add_action( 'wp_enqueue_scripts', array( $frontend, 'enqueue_assets' ) );
    }
}
```

Rules:

* Hooks may be registered in the main plugin class or in clearly named module classes.
* Do not scatter hooks randomly through unrelated files.
* Do not let the main class become a business-logic container.
* If the plugin becomes large, move hook registration into module/service providers.

---

## WordPress Core APIs and Helpers To Prefer

Use WordPress APIs before custom solutions.

| Need                   | Prefer                                                                                |
| ---------------------- | ------------------------------------------------------------------------------------- |
| Plugin filesystem path | `plugin_dir_path( __FILE__ )`                                                         |
| Plugin URL             | `plugin_dir_url( __FILE__ )`                                                          |
| Plugin basename        | `plugin_basename( __FILE__ )`                                                         |
| Hooks                  | `add_action()`, `add_filter()`                                                        |
| Activation             | `register_activation_hook()`                                                          |
| Deactivation           | `register_deactivation_hook()`                                                        |
| Admin menus            | `add_menu_page()`, `add_submenu_page()`                                               |
| Options                | `get_option()`, `update_option()`, `delete_option()`                                  |
| Temporary cache        | `get_transient()`, `set_transient()`, `delete_transient()`                            |
| Scripts                | `wp_enqueue_script()`                                                                 |
| Styles                 | `wp_enqueue_style()`                                                                  |
| AJAX                   | `admin-ajax.php` hooks or REST routes                                                 |
| REST API               | `register_rest_route()`                                                               |
| Database               | `$wpdb`, `$wpdb->prepare()`, `dbDelta()`                                              |
| Errors                 | `WP_Error`                                                                            |
| HTTP requests          | `wp_remote_get()`, `wp_remote_post()`                                                 |
| Scheduled jobs         | WP-Cron functions                                                                     |
| Security checks        | `current_user_can()`, nonces, sanitizing, escaping                                    |
| Admin tables           | Use carefully; prefer simple custom tables unless a WordPress list table is justified |

Do not hardcode plugin URLs, filesystem paths, admin URLs, or table names when WordPress provides a safer helper.

---

## PHP Architecture Rules

Use procedural PHP only at WordPress boundaries when it keeps the plugin simple.

Use classes for:

* Plugin structure
* Services
* Repositories
* Adapters
* Admin screens
* REST controllers
* AJAX handlers
* Cron jobs
* Larger business logic

Recommended flow:

```text
WordPress hooks
    ↓
Controller / Admin screen / REST route / AJAX handler
    ↓
Service
    ↓
Repository / Adapter
    ↓
WordPress API / Database / External API
```

Rules:

* Controllers handle requests.
* Services handle business logic.
* Repositories handle database access.
* Adapters hide external APIs.
* Support classes provide reusable helpers.
* Templates render output.
* The root plugin file only boots the plugin.

---

## Database Layer Rules

Use WordPress options, post meta, user meta, or terms when they fit naturally.

Use custom tables when:

* The plugin stores high-volume event data
* The data needs reporting or filtering
* The data is not really WordPress content
* Queries would become messy or slow in post meta
* The data has its own lifecycle

### Installer Class

`class-installer.php` creates tables on activation and runs version-checked upgrades.

Example:

```php
<?php

defined( 'ABSPATH' ) || exit;

/**
 * Handles database installation and upgrades.
 */
class Example_Plugin_Installer {

    /**
     * Install or update plugin tables.
     *
     * @return void
     */
    public static function install(): void {
        global $wpdb;

        $table_name      = $wpdb->prefix . 'example_plugin_events';
        $charset_collate = $wpdb->get_charset_collate();

        $sql = "CREATE TABLE {$table_name} (
            id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            source VARCHAR(100) NOT NULL DEFAULT '',
            campaign VARCHAR(100) NOT NULL DEFAULT '',
            event_type VARCHAR(50) NOT NULL DEFAULT '',
            payload LONGTEXT NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY  (id),
            KEY idx_source (source),
            KEY idx_created_at (created_at)
        ) {$charset_collate};";

        require_once ABSPATH . 'wp-admin/includes/upgrade.php';

        dbDelta( $sql );

        update_option( 'example_plugin_db_version', EXAMPLE_PLUGIN_VERSION );
    }
}
```

### Repository Class

All SQL lives in repositories.

Business classes never touch `$wpdb` directly.

Example:

```php
<?php

defined( 'ABSPATH' ) || exit;

/**
 * Handles event database queries.
 */
class Example_Plugin_Repository {

    /**
     * WordPress database object.
     *
     * @var wpdb
     */
    private $wpdb;

    /**
     * Events table name.
     *
     * @var string
     */
    private string $table;

    /**
     * Constructor.
     */
    public function __construct() {
        global $wpdb;

        $this->wpdb  = $wpdb;
        $this->table = $wpdb->prefix . 'example_plugin_events';
    }

    /**
     * Insert a row.
     *
     * @param array<string, mixed> $data Row data.
     * @return int Insert ID.
     */
    public function insert( array $data ): int {
        $this->wpdb->insert( $this->table, $data );

        return (int) $this->wpdb->insert_id;
    }

    /**
     * Get rows by source.
     *
     * @param string $source Source value.
     * @return array<int, array<string, mixed>>
     */
    public function get_by_source( string $source ): array {
        return $this->wpdb->get_results(
            $this->wpdb->prepare(
                "SELECT * FROM {$this->table} WHERE source = %s ORDER BY created_at DESC",
                $source
            ),
            ARRAY_A
        );
    }
}
```

Database rules:

* No SQL outside repository or installer classes.
* Use `$wpdb->prepare()` for parameterized queries.
* Use `dbDelta()` for table creation and upgrades.
* Prefix custom tables with `$wpdb->prefix`.
* Store plugin DB version in options.
* Record custom tables in `DATABASE.md`.

---

## Adapter Pattern for External APIs

One class per external service.

The service layer calls the adapter.

The project does not call the raw API everywhere.

Example:

```php
<?php

defined( 'ABSPATH' ) || exit;

/**
 * Adapter for GA4 Measurement Protocol.
 */
class Example_Plugin_GA4_Adapter {

    /**
     * GA4 measurement ID.
     *
     * @var string
     */
    private string $measurement_id;

    /**
     * GA4 API secret.
     *
     * @var string
     */
    private string $api_secret;

    /**
     * Constructor.
     *
     * @param string $measurement_id GA4 measurement ID.
     * @param string $api_secret     GA4 API secret.
     */
    public function __construct( string $measurement_id, string $api_secret ) {
        $this->measurement_id = $measurement_id;
        $this->api_secret     = $api_secret;
    }

    /**
     * Send an event to GA4.
     *
     * @param string               $event_name Event name.
     * @param array<string, mixed> $params     Event params.
     * @return bool
     */
    public function send_event( string $event_name, array $params ): bool {
        $url = 'https://www.google-analytics.com/mp/collect'
            . '?measurement_id=' . rawurlencode( $this->measurement_id )
            . '&api_secret=' . rawurlencode( $this->api_secret );

        $response = wp_remote_post(
            $url,
            array(
                'body'    => wp_json_encode(
                    array(
                        'events' => array(
                            array(
                                'name'   => $event_name,
                                'params' => $params,
                            ),
                        ),
                    )
                ),
                'headers' => array(
                    'Content-Type' => 'application/json',
                ),
                'timeout' => 5,
            )
        );

        return ! is_wp_error( $response );
    }
}
```

Adapter rules:

* External APIs are wrapped behind adapters.
* Services call adapters.
* Adapters return simple values, arrays, DTOs, or `WP_Error`.
* Do not spread SDK/API calls through admin pages, templates, repositories, or root plugin files.
* Secrets must not be hardcoded.

---

## Admin Dashboard Pattern

Admin pages should be owner-mode-first and analyst-mode-second.

The first view should help a business owner understand what happened.

The deeper view can show tables, logs, filters, and exports.

Example admin view:

```php
<?php
/**
 * Admin dashboard view.
 *
 * Expected variables:
 * - array $stats
 * - string $export_url
 */

defined( 'ABSPATH' ) || exit;
?>

<div class="wrap example-plugin-dashboard">
    <h1><?php echo esc_html( get_admin_page_title() ); ?></h1>

    <div class="example-plugin-kpi-row">
        <div class="example-plugin-tile">
            <span class="example-plugin-tile-number">
                <?php echo esc_html( $stats['today'] ?? 0 ); ?>
            </span>
            <span class="example-plugin-tile-label">
                <?php esc_html_e( 'Today', 'example-plugin' ); ?>
            </span>
        </div>

        <div class="example-plugin-tile">
            <span class="example-plugin-tile-number">
                <?php echo esc_html( $stats['this_week'] ?? 0 ); ?>
            </span>
            <span class="example-plugin-tile-label">
                <?php esc_html_e( 'This week', 'example-plugin' ); ?>
            </span>
        </div>
    </div>

    <div class="example-plugin-table-wrap">
        <a href="<?php echo esc_url( $export_url ); ?>" class="button">
            <?php esc_html_e( 'Export CSV', 'example-plugin' ); ?>
        </a>

        <!-- Table goes here. -->
    </div>
</div>
```

Rules:

* Admin pages render from view/template files.
* Business logic does not live in admin views.
* Views escape everything.
* Admin classes prepare data before loading views.
* Owner-friendly summaries come before analyst tables.

---

## Asset Rules

All CSS and JavaScript must be loaded through WordPress enqueue functions.

Do not echo `<script>` or `<style>` tags directly into pages unless there is a narrow WordPress-approved reason.

Do not use inline styles for normal UI styling.

Use:

* CSS files in `assets/css/`
* JavaScript files in `assets/js/`
* CSS variables for colors, spacing, borders, shadows, and reusable design tokens
* Flexbox or CSS Grid for layout
* WordPress admin classes where suitable
* Bootstrap only when it is scoped and justified
* Tailwind only when the build process is approved and worth the extra complexity

Example enqueue pattern:

```php
<?php

defined( 'ABSPATH' ) || exit;

/**
 * Admin module.
 */
class Example_Plugin_Admin {

    /**
     * Enqueue admin assets only on plugin screens.
     *
     * @param string $hook_suffix Current admin page hook.
     * @return void
     */
    public function enqueue_assets( string $hook_suffix ): void {
        if ( 'toplevel_page_example-plugin' !== $hook_suffix ) {
            return;
        }

        wp_enqueue_style(
            'example-plugin-admin',
            EXAMPLE_PLUGIN_URL . 'assets/css/admin.css',
            array(),
            EXAMPLE_PLUGIN_VERSION
        );

        wp_enqueue_script(
            'example-plugin-admin',
            EXAMPLE_PLUGIN_URL . 'assets/js/admin.js',
            array(),
            EXAMPLE_PLUGIN_VERSION,
            true
        );
    }
}
```

---

## CSS Rules

Use CSS variables instead of scattered values.

Do not use inline styles for maintainable UI.

Prefer Flexbox or CSS Grid for layout.

Example:

```css
:root {
    --example-primary: #f5c400;
    --example-black: #111111;
    --example-white: #ffffff;
    --example-border: #dddddd;
    --example-radius: 8px;
    --example-gap: 1rem;
}

.example-plugin-admin {
    color: var(--example-black);
}

.example-plugin-kpi-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: var(--example-gap);
}

.example-plugin-tile {
    background: var(--example-white);
    border: 1px solid var(--example-border);
    border-radius: var(--example-radius);
    padding: var(--example-gap);
}
```

### Bootstrap Rule

Shaun is more familiar with Bootstrap than Tailwind.

Bootstrap may be used when it speeds up interface work and does not pollute the theme or WordPress admin globally.

If Bootstrap is used:

* Scope it to the plugin screen where possible.
* Do not load it across the whole site unless absolutely required.
* Do not fight WordPress admin styles unnecessarily.
* Prefer WordPress admin UI patterns for simple admin screens.
* Record the choice in `TECH-SPEC.md`.

### Tailwind Rule

Tailwind is allowed only when:

* The project benefits from a utility-first build process.
* The build tooling is documented.
* Shaun approves the extra learning and maintenance cost.
* The generated CSS is scoped and production-ready.

Do not choose Tailwind just because it is fashionable.

---

## UI and CSS Prohibited Actions

* Do not use inline styles for maintainable UI.
* Do not scatter colors through templates.
* Do not duplicate spacing, color, shadow, or border values across many files.
* Do not load frontend CSS on every page unless the plugin needs it.
* Do not load admin CSS on every admin screen unless required.
* Do not let Bootstrap or plugin CSS break the active theme.
* Do not use JavaScript for layout that CSS can handle.
* Do not create visual rules in PHP strings unless unavoidable.
* Do not echo raw `<style>` tags as a normal styling strategy.

---

## Security Rules

Every plugin must pass a basic security review before shipping.

| Rule                   | How                                                                                        |   |                            |
| ---------------------- | ------------------------------------------------------------------------------------------ | - | -------------------------- |
| Sanitize all input     | `sanitize_text_field()`, `sanitize_email()`, `esc_url_raw()`, `absint()`, `wp_kses_post()` |   |                            |
| Escape all output      | `esc_html()`, `esc_attr()`, `esc_url()`, `wp_kses_post()`                                  |   |                            |
| Nonces on forms        | `wp_nonce_field()` in form, `check_admin_referer()` before processing                      |   |                            |
| Capability checks      | `current_user_can()` before admin actions                                                  |   |                            |
| Safe database queries  | `$wpdb->prepare()` for parameterized queries                                               |   |                            |
| No direct file access  | `defined( 'ABSPATH' )                                                                      |   | exit;` at top of PHP files |
| Safe AJAX              | Validate nonce and capability before state changes                                         |   |                            |
| Safe REST              | Use `permission_callback`                                                                  |   |                            |
| Safe external requests | Use WordPress HTTP API and handle `WP_Error`                                               |   |                            |
| Safe uninstall         | Delete only what the plugin owns                                                           |   |                            |

Security checklist:

* [ ] Direct file access is blocked.
* [ ] User capabilities are checked before admin actions.
* [ ] Nonces are used for form submissions and state-changing actions.
* [ ] Input is sanitized.
* [ ] Output is escaped.
* [ ] Database queries use prepared statements.
* [ ] AJAX endpoints validate permissions.
* [ ] REST endpoints define `permission_callback`.
* [ ] Secrets are not stored in code.
* [ ] External requests are handled through adapters or services.
* [ ] Uninstall behavior is deliberate.

---

## Process

### Step 1 — Define the Plugin Identity

Define:

* Plugin name
* Plugin slug
* Version
* Text domain
* Main file name
* Minimum WordPress version
* Minimum PHP version
* Admin/frontend/API scope
* First useful build slice

### Step 2 — Choose the Structure

Choose either:

* Shaun Default WordPress Plugin Structure
* Scalable OOP / Composer Structure

Record the choice in `ARCHITECTURE.md`.

### Step 3 — Create the Folder Structure

Create the approved folder layout.

Create placeholder files only when they are needed for the first build slice.

Do not create empty architecture theatre.

### Step 4 — Write the Main Plugin File

Add:

* Plugin header
* Direct-access guard
* Constants
* Required class files or autoloader
* Activation/deactivation hooks
* Boot call

### Step 5 — Write the Installer

If custom tables are needed:

* Create tables with `dbDelta()`
* Store DB version
* Test plugin activation
* Confirm table exists
* Record schema in `DATABASE.md`

### Step 6 — Write the Repository

Every query goes in one place.

No SQL in services, admin views, frontend templates, or root files.

### Step 7 — Write the Services

Services contain business logic only.

Services do not:

* Echo HTML
* Read raw `$_POST`
* Perform SQL directly
* Call external APIs directly when an adapter should exist

### Step 8 — Write Admin or Frontend Modules

Admin modules:

* Register menus
* Enqueue admin assets
* Handle admin actions
* Prepare data for views

Frontend modules:

* Register shortcodes, blocks, or frontend hooks
* Enqueue public assets only when needed
* Load templates safely

### Step 9 — Wire Hooks

Register hooks in the approved place.

For smaller plugins, use the main plugin class.

For larger plugins, use module classes or service providers.

### Step 10 — Smoke Test

Test:

* Plugin activates without fatal errors
* Plugin deactivates without fatal errors
* Admin page loads
* Assets load only where expected
* Forms have nonces
* Database table exists if required
* Repository reads/writes correctly if required
* Shortcodes/routes/AJAX handlers work if required
* No PHP warnings or notices appear
* `ARCHITECTURE.md` matches the real folder structure

---

## Quality Check

Before handing back to Shaun:

* [ ] Main plugin file is thin.
* [ ] Plugin header exists.
* [ ] Direct-access guard exists in PHP files.
* [ ] Constants use WordPress path and URL helpers.
* [ ] Activation and deactivation hooks are registered if needed.
* [ ] Folder structure matches `ARCHITECTURE.md`.
* [ ] No SQL outside repository or installer files.
* [ ] No business logic in admin views or frontend templates.
* [ ] No `echo` outside approved view/template files unless justified.
* [ ] No raw `$_POST`, `$_GET`, or `$_REQUEST` without sanitizing and nonce/capability checks.
* [ ] Every form has a nonce field.
* [ ] Every admin action checks `current_user_can()`.
* [ ] Every output is escaped.
* [ ] Every input is sanitized.
* [ ] Assets are enqueued, not hardcoded.
* [ ] CSS lives in asset files, not inline styles.
* [ ] CSS variables are used for reusable design values.
* [ ] Bootstrap or Tailwind choices are recorded if used.
* [ ] External APIs are behind adapters.
* [ ] Custom tables are recorded in `DATABASE.md`.
* [ ] `ARCHITECTURE.md` reflects the actual folder structure.
* [ ] `AI-NOTES.md` records important decisions and unresolved issues.

---

## Prohibited Actions

* Do not put business logic in the root plugin file.
* Do not put SQL in admin screens, services, frontend templates, or root files.
* Do not hardcode plugin paths or URLs.
* Do not hardcode table names without `$wpdb->prefix`.
* Do not echo unescaped user-controlled output.
* Do not read request data without sanitizing it.
* Do not process state-changing actions without nonce checks.
* Do not skip capability checks for admin actions.
* Do not load admin CSS or JS on every admin screen unless required.
* Do not load frontend CSS or JS globally unless required.
* Do not use inline styles as a normal styling strategy.
* Do not introduce React, Tailwind, Composer, build tooling, or external dependencies unless the project earns that complexity.
* Do not add patterns for their own sake.
* Do not create empty folders and classes that do not support the first build slice.
* Do not let Bootstrap, plugin CSS, or JavaScript break the active theme or WordPress admin.
* Do not hide external API calls throughout the project.
* Do not change plugin architecture without updating `ARCHITECTURE.md` and `AI-NOTES.md`.

---

## Final Rule

Build WordPress plugins the WordPress way.

Use WordPress core APIs before inventing custom infrastructure.

Keep the main plugin file thin.

Keep hooks controlled.

Keep assets organized.

Keep styles maintainable.

Keep database access isolated.

Keep external services behind adapters.

Keep architecture obvious.

Make the plugin something Shaun can open six months later and still understand.
