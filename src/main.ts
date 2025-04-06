import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";

import octicons from "@primer/octicons";
import activity from "./activity.json" assert { type: "json" };

declare global {
	interface HTMLElementTagNameMap {
		"activity-warashi-dev-main": ActivityWarashiDevMain;
		"activity-warashi-dev-header": ActivityWarashiDevHeader;
		"activity-warashi-dev-item": ActivityWarashiDevItem;
		"activity-warashi-dev-activities": ActivityWarashiDevActivities;
	}
}

// in miliseconds
const units = {
	year: 24 * 60 * 60 * 1000 * 365,
	month: (24 * 60 * 60 * 1000 * 365) / 12,
	day: 24 * 60 * 60 * 1000,
	hour: 60 * 60 * 1000,
	minute: 60 * 1000,
	second: 1000,
};

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

const getRelativeTime = (d1: Date, d2: Date = new Date()) => {
	const elapsed = d1.getTime() - d2.getTime();

	// "Math.abs" accounts for both "past" & "future" scenarios
	for (const u in units) {
		if (Math.abs(elapsed) > units[u as keyof typeof units] || u === "second") {
			return rtf.format(
				Math.round(elapsed / units[u as keyof typeof units]),
				u as keyof typeof units,
			);
		}
	}
};

@customElement("activity-warashi-dev-main")
export class ActivityWarashiDevMain extends LitElement {
	@property({ type: Array })
	activities: Activity[] = activity.data.search.edges.map(
		(edge) => edge.node as Activity,
	);

	render() {
		return html`
            <div style="max-width: 960px; margin: 0 auto;">
                <activity-warashi-dev-header></activity-warashi-dev-header>
                <activity-warashi-dev-activities .activities=${this.activities}></activity-warashi-dev-activities>
            </div>
        `;
	}

	static styles = css`
        :host {
            display: block;
            padding: 24px;
        }
    `;
}

@customElement("activity-warashi-dev-activities")
export class ActivityWarashiDevActivities extends LitElement {
	constructor(activities: Activity[]) {
		super();
		this.activities = activities;
	}

	@property({ type: Array })
	activities: Activity[];

	render() {
		return html`
            <div style="display: flex; flex-direction: column; gap: 16px;">
                ${this.activities.map((activity) => html`<activity-warashi-dev-item .activity=${activity}></activity-warashi-dev-item>`)}
            </div>
        `;
	}
}

@customElement("activity-warashi-dev-header")
export class ActivityWarashiDevHeader extends LitElement {
	@property({ type: String })
	title = "Warashi's Activity";

	static styles = css`
		:host {
			color: #1a2b4c;
		}
	`;

	render() {
		return html`
            <h1>${this.title}</h1>
        `;
	}
}

@customElement("activity-warashi-dev-item")
export class ActivityWarashiDevItem extends LitElement {
	constructor(activity: Activity) {
		super();
		this.activity = activity;
	}

	@property({ type: Object })
	activity: Activity;

	static styles = css`
		.activity-warashi-dev-item-link {
			display: flex;
			flex-direction: row;
			max-width: 100%;
			gap: 16px;
			text-decoration: none;
			padding: 8px;
			border-radius: 8px;
		}

		.activity-warashi-dev-item-link>* {
			min-width: 0;
		}

		.activity-warashi-dev-item-link:hover {
			background-color: #f0f0f0;
			text-decoration: none;
		}

		.activity-warashi-dev-profile-image {
			border-radius: 10%;
			width: 48px;
			height: 48px;
			align-self: center;
			flex-shrink: 0;
			flex-grow: 0;
		}

		.activity-warashi-dev-item-link-title {
			font-size: 16px;
			font-weight: bold;
			color: rgb(90, 90, 90);

			text-overflow: ellipsis;
			white-space: nowrap;
			overflow: hidden;
		}

		.activity-warashi-dev-item-link-number {
			font-size: 14px;
			color: gray;
			display: flex;
			justify-content: flex-end;
			text-align: right;
		}

		.activity-warashi-dev-item-link-repository {
			font-size: 14px;
			color: gray;

			text-overflow: ellipsis;
			white-space: nowrap;
			overflow: hidden;
		}

		.activity-warashi-dev-item-link-time {
			font-size: 14px;
			color: gray;
			display: flex;
			justify-content: flex-end;
			flex-grow: 1;
			text-align: right;
		}

		.activity-warashi-dev-item-link-repository {
			display: flex;
			flex-direction: row;
			gap: 4px;
		}

		.activity-warashi-dev-item-link-repository-owner {
			font-size: 14px;
			color: gray;
		}

		.activity-warashi-dev-item-link-repository-separator {
			font-size: 14px;
			color: gray;
		}

		.activity-warashi-dev-item-link-repository-name {
			font-size: 14px;
			color: gray;
		}
	`

	render() {
		return html`
            <div>
                <a href="${this.activity.url}" target="_blank" rel="noopener noreferrer" class="activity-warashi-dev-item-link">
                    <img src="${this.activity.repository.owner.avatarUrl}&size=48" alt="${this.activity.repository.owner.login}" loading="lazy" class="activity-warashi-dev-profile-image"/>
					<div style="display: flex; flex-direction: column; gap: 4px; flex-grow: 0; flex-shrink: 1;">
                        <div style="display: flex; flex-direction: row; gap: 8px;">
                            <activity-warashi-dev-item-icon .activity=${this.activity}></activity-warashi-dev-item-icon>
                            <div class="activity-warashi-dev-item-link-title">${this.activity.title}</div>
                        </div>
						<div class="activity-warashi-dev-item-link-repository">
							<div class="activity-warashi-dev-item-link-repository-owner">${this.activity.repository.owner.login}</div>
							<div class="activity-warashi-dev-item-link-repository-separator">/</div>
							<div class="activity-warashi-dev-item-link-repository">${this.activity.repository.name}</div>
						</div>
                    </div>
					<div style="display: flex; flex-direction: column; gap: 4px; flex-grow: 1; flex-shrink: 0;">
						<div class="activity-warashi-dev-item-link-number">#${this.activity.number}</div>
						<div class="activity-warashi-dev-item-link-time">${getRelativeTime(new Date(this.activity.createdAt))}</div>
					</div>
                </a>
            </div>
        `;
	}
}

@customElement("activity-warashi-dev-item-icon")
export class ActivityWarashiDevItemIcon extends LitElement {
	constructor(activity: Activity) {
		super();
		this.activity = activity;
	}

	@property({ type: Object })
	activity: Activity;

	icons = {
		"git-pull-request-draft": octicons["git-pull-request-draft"].toSVG({
			class: "activity-warashi-dev-item-icon",
		}),
		"git-pull-request-merged": octicons["git-pull-request"].toSVG({
			class: "activity-warashi-dev-item-icon",
		}),
		"git-pull-request-open": octicons["git-pull-request"].toSVG({
			class: "activity-warashi-dev-item-icon",
		}),
		"git-pull-request-closed": octicons["git-pull-request-closed"].toSVG({
			class: "activity-warashi-dev-item-icon",
		}),
		"issue-opened": octicons["issue-opened"].toSVG({
			class: "activity-warashi-dev-item-icon",
		}),
		"issue-closed-not-planned": octicons["issue-closed"].toSVG({
			class: "activity-warashi-dev-item-icon",
		}),
		"issue-closed-completed": octicons["issue-closed"].toSVG({
			class: "activity-warashi-dev-item-icon",
		}),
		"issue-closed-duplicate": octicons["issue-closed"].toSVG({
			class: "activity-warashi-dev-item-icon",
		}),
		"issue-closed": octicons["issue-closed"].toSVG({
			class: "activity-warashi-dev-item-icon",
		}),
	};

	static styles = css`
		.activity-warashi-dev-item-icon-container {
            display: flex;
            align-items: center;
            justify-content: center;
			border-radius: 100vh;
			padding: 0.3vh 1vh;
			gap: 0.5vh;
        }

        .activity-warashi-dev-item-icon {
            fill: white;
        }

        .activity-warashi-dev-item-icon-container-text {
            font-size: small;
            font-weight: bold;
            color: white;
        }

		.activity-warashi-dev-item-icon-container-pull-request-draft {
            background-color: gray;
        }

        .activity-warashi-dev-item-icon-container-pull-request-merged {
            background-color: purple;
        }

        .activity-warashi-dev-item-icon-container-pull-request-open {
            background-color: green;
        }

        .activity-warashi-dev-item-icon-container-pull-request-closed {
            background-color: firebrick;
        }

        .activity-warashi-dev-item-icon-container-issue-opened {
            background-color: green;
        }

        .activity-warashi-dev-item-icon-container-issue-closed-not-planned {
            background-color: gray;
        }

        .activity-warashi-dev-item-icon-container-issue-closed-completed {
            background-color: purple;
        }

        .activity-warashi-dev-item-icon-container-issue-closed-duplicate {
            background-color: gray;
        }

        .activity-warashi-dev-item-icon-container-issue-closed {
            background-color: firebrick;
        }
    `;

	render() {
		if (this.activity.__typename === "PullRequest") {
			if (this.activity.prState === "OPEN") {
				if (this.activity.isDraft) {
					return html`
						<div class="activity-warashi-dev-item-icon-container activity-warashi-dev-item-icon-container-pull-request-draft">
							${unsafeSVG(this.icons["git-pull-request-draft"])}
							<div class="activity-warashi-dev-item-icon-container-text">Draft</div>
						</div>
					`;
				}
				return html`
					<div class="activity-warashi-dev-item-icon-container activity-warashi-dev-item-icon-container-pull-request-open">
						${unsafeSVG(this.icons["git-pull-request-open"])}
						<div class="activity-warashi-dev-item-icon-container-text">Open</div>
					</div>
				`;
			} else if (this.activity.prState === "MERGED") {
				return html`
					<div class="activity-warashi-dev-item-icon-container activity-warashi-dev-item-icon-container-pull-request-merged">
						${unsafeSVG(this.icons["git-pull-request-merged"])}
						<div class="activity-warashi-dev-item-icon-container-text">Merged</div>
					</div>
				`;
			} else if (this.activity.prState === "CLOSED") {
				return html`
					<div class="activity-warashi-dev-item-icon-container activity-warashi-dev-item-icon-container-pull-request-closed">
						${unsafeSVG(this.icons["git-pull-request-closed"])}
						<div class="activity-warashi-dev-item-icon-container-text">Closed</div>
					</div>
				`;
			}
		}
		if (this.activity.__typename === "Issue") {
			if (this.activity.issueState === "OPEN") {
				return html`
					<div class="activity-warashi-dev-item-icon-container activity-warashi-dev-item-icon-container-issue-opened">
						${unsafeSVG(this.icons["issue-opened"])}
						<div class="activity-warashi-dev-item-icon-container-text">Open</div>
					</div>
				`;
			} else if (this.activity.stateReason === "NOT_PLANNED") {
				return html`
					<div class="activity-warashi-dev-item-icon-container activity-warashi-dev-item-icon-container-issue-closed-not-planned">
						${unsafeSVG(this.icons["issue-closed-not-planned"])}
						<div class="activity-warashi-dev-item-icon-container-text">Not Planned</div>
					</div>
				`;
			} else if (this.activity.stateReason === "COMPLETED") {
				return html`
					<div class="activity-warashi-dev-item-icon-container activity-warashi-dev-item-icon-container-issue-closed-completed">
						${unsafeSVG(this.icons["issue-closed-completed"])}
						<div class="activity-warashi-dev-item-icon-container-text">Completed</div>
					</div>
				`;
			} else if (this.activity.stateReason === "DUPLICATE") {
				return html`
					<div class="activity-warashi-dev-item-icon-container activity-warashi-dev-item-icon-container-issue-closed-duplicate">
						${unsafeSVG(this.icons["issue-closed-duplicate"])}
						<div class="activity-warashi-dev-item-icon-container-text">Duplicate</div>
					</div>
				`;
			} else {
				return html`
					<div class="activity-warashi-dev-item-icon-container activity-warashi-dev-item-icon-container-issue-closed">
						${unsafeSVG(this.icons["issue-closed"])}
						<div class="activity-warashi-dev-item-icon-container-text">Closed</div>
					</div>
				`;
			}
		}
	}
}

type Activity = Issue | PullRequest;

type Issue = {
	__typename: "Issue";
	createdAt: string;
	issueState: "OPEN" | "CLOSED";
	stateReason: "REOPENED" | "NOT_PLANNED" | "COMPLETED" | "DUPLICATE";
	title: string;
	url: string;
	number: number;
	repository: {
		owner: {
			login: string;
			avatarUrl: string;
			url: string;
		};
		name: string;
	};
};

type PullRequest = {
	__typename: "PullRequest";
	createdAt: string;
	prState: "MERGED" | "OPEN" | "CLOSED";
	isDraft: boolean;
	title: string;
	url: string;
	number: number;
	repository: {
		owner: {
			login: string;
			avatarUrl: string;
			url: string;
		};
		name: string;
	};
};
