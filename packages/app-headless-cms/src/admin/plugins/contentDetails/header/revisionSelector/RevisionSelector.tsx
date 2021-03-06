import React from "react";
import { css } from "emotion";
import { useRouter } from "@webiny/react-router";
import { ButtonDefault } from "@webiny/ui/Button";
import { Icon } from "@webiny/ui/Icon";
import { ReactComponent as DownButton } from "@webiny/app-headless-cms/admin/icons/round-arrow_drop_down-24px.svg";
import { Typography } from "@webiny/ui/Typography";
import { Menu, MenuItem } from "@webiny/ui/Menu";
import { get } from "lodash";
const buttonStyle = css({
    "&.mdc-button": {
        color: "var(--mdc-theme-text-primary-on-background) !important"
    }
});

const menuStyles = css({
    width: 150,
    right: 0,
    ".mdc-list-item": {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "baseline",
        textAlign: "left"
    }
});

const RevisionSelector = ({ content, getLoading, revisionsList }) => {
    const { location, history } = useRouter();
    const query = new URLSearchParams(location.search);

    const currentRevision = {
        version: get(content, "meta.version", 1),
        status: get(content, "meta.status", "draft")
    };

    const allRevisions = get(revisionsList, "data.content.data.meta.revisions", [
        { id: "new", meta: { version: 1, status: "draft" } }
    ]);

    return (
        <Menu
            className={menuStyles}
            handle={
                <ButtonDefault className={buttonStyle} disabled={getLoading()}>
                    v{currentRevision.version} ({currentRevision.status}){" "}
                    <Icon icon={<DownButton />} />
                </ButtonDefault>
            }
        >
            {allRevisions.map(revision => (
                <MenuItem
                    key={revision.id}
                    onClick={() => {
                        query.set("id", revision.id);
                        history.push({ search: query.toString() });
                    }}
                >
                    <Typography use={"body2"}>v{revision.meta.version}</Typography>
                    <Typography use={"caption"}>({revision.meta.status})</Typography>
                </MenuItem>
            ))}
        </Menu>
    );
};

export default RevisionSelector;
