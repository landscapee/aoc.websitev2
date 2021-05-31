import { remote } from '../electron';
import React from 'react';

export const editPermission = (role) => {
	let roleCodes = remote.getGlobal('roleCodes');
	let roleCodeIndex = roleCodes.indexOf(role);
	if (roleCodeIndex === -1) {
		return {
			onClick: () => {},
		};
	}
	return {};
};

export const hasEditPermission = (role) => {
	let roleCodes = remote.getGlobal('roleCodes');
	let roleCodeIndex = roleCodes.indexOf(role);
	return roleCodeIndex > -1;
};

/**
 *
 * 无权限显示的内容
 */
export const editPermissionNode = (role, customNoPermission) => {
	return hasEditPermission(role) ? false : customNoPermission || <div />;
};
