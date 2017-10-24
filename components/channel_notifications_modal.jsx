// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import $ from 'jquery';

import PropTypes from 'prop-types';
import React from 'react';
import {Modal} from 'react-bootstrap';
import {FormattedMessage} from 'react-intl';

import {updateChannelNotifyProps} from 'actions/channel_actions.jsx';

import {NotificationLevels} from 'utils/constants.jsx';

import SettingItemMax from 'components/setting_item_max.jsx';
import SettingItemMin from 'components/setting_item_min.jsx';

export default class ChannelNotificationsModal extends React.Component {
    constructor(props) {
        super(props);

        this.updateSection = this.updateSection.bind(this);
        this.onHide = this.onHide.bind(this);

        this.handleSubmitDesktopNotifyLevel = this.handleSubmitDesktopNotifyLevel.bind(this);
        this.handleUpdateDesktopNotifyLevel = this.handleUpdateDesktopNotifyLevel.bind(this);
        this.createDesktopNotifyLevelSection = this.createDesktopNotifyLevelSection.bind(this);

        this.handleSubmitMarkUnreadLevel = this.handleSubmitMarkUnreadLevel.bind(this);
        this.handleUpdateMarkUnreadLevel = this.handleUpdateMarkUnreadLevel.bind(this);
        this.createMarkUnreadLevelSection = this.createMarkUnreadLevelSection.bind(this);

        this.handleSubmitPushNotificationLevel = this.handleSubmitPushNotificationLevel.bind(this);
        this.handleUpdatePushNotificationLevel = this.handleUpdatePushNotificationLevel.bind(this);
        this.createPushNotificationLevelSection = this.createPushNotificationLevelSection.bind(this);

        this.handleSubmitMuteNotificationLevel = this.handleSubmitMuteNotificationLevel.bind(this);
        this.handleUpdateMuteNotificationLevel = this.handleUpdateMuteNotificationLevel.bind(this);
        this.createMuteNotificationLevelSection = this.createMuteNotificationLevelSection.bind(this);

        this.state = {
            activeSection: '',
            show: true,
            notifyLevel: props.channelMember.notify_props.desktop,
            unreadLevel: props.channelMember.notify_props.mark_unread,
            pushLevel: props.channelMember.notify_props.push || NotificationLevels.DEFAULT,
            muteLevel: props.channelMember.notify_props.mute || 'false'
        };
    }

    updateSection(section) {
        if ($('.section-max').length) {
            $('.settings-modal .modal-body').scrollTop(0).perfectScrollbar('update');
        }
        this.setState({activeSection: section});
    }

    onHide() {
        this.setState({show: false});
    }

    handleSubmitDesktopNotifyLevel() {
        const channelId = this.props.channel.id;
        const notifyLevel = this.state.notifyLevel;
        const currentUserId = this.props.currentUser.id;

        if (this.props.channelMember.notify_props.desktop === notifyLevel) {
            this.updateSection('');
            return;
        }

        const options = {desktop: notifyLevel};
        const data = {
            channel_id: channelId,
            user_id: currentUserId
        };

        updateChannelNotifyProps(data, options,
            () => {
                this.updateSection('');
            },
            (err) => {
                this.setState({serverError: err.message});
            }
        );
    }

    handleUpdateDesktopNotifyLevel(notifyLevel) {
        this.setState({notifyLevel});
    }

    createDesktopNotifyLevelSection(serverError) {
        const muteChannel = this.props.channelMember.notify_props ? this.props.channelMember.notify_props.mute : 'false';
        if (muteChannel === 'true') {
            return null;
        }

        // Get glabal user setting for notifications
        const globalNotifyLevel = this.props.currentUser.notify_props ? this.props.currentUser.notify_props.desktop : NotificationLevels.ALL;
        let globalNotifyLevelName;
        if (globalNotifyLevel === NotificationLevels.ALL) {
            globalNotifyLevelName = (
                <FormattedMessage
                    id='channel_notifications.allActivity'
                    defaultMessage='For all activity'
                />
            );
        } else if (globalNotifyLevel === NotificationLevels.MENTION) {
            globalNotifyLevelName = (
                <FormattedMessage
                    id='channel_notifications.onlyMentions'
                    defaultMessage='Only for mentions'
                />
            );
        } else {
            globalNotifyLevelName = (
                <FormattedMessage
                    id='channel_notifications.never'
                    defaultMessage='Never'
                />
            );
        }

        const sendDesktop = (
            <FormattedMessage
                id='channel_notifications.sendDesktop'
                defaultMessage='Send desktop notifications'
            />
        );

        const notificationLevel = this.state.notifyLevel;

        if (this.state.activeSection === 'desktop') {
            const notifyActive = [false, false, false, false];
            if (notificationLevel === NotificationLevels.DEFAULT) {
                notifyActive[0] = true;
            } else if (notificationLevel === NotificationLevels.ALL) {
                notifyActive[1] = true;
            } else if (notificationLevel === NotificationLevels.MENTION) {
                notifyActive[2] = true;
            } else {
                notifyActive[3] = true;
            }

            var inputs = [];

            inputs.push(
                <div key='channel-notification-level-radio'>
                    <div className='radio'>
                        <label>
                            <input
                                id='channelNotificationGlobalDefault'
                                type='radio'
                                name='desktopNotificationLevel'
                                checked={notifyActive[0]}
                                onChange={this.handleUpdateDesktopNotifyLevel.bind(this, NotificationLevels.DEFAULT)}
                            />
                            <FormattedMessage
                                id='channel_notifications.globalDefault'
                                defaultMessage='Global default ({notifyLevel})'
                                values={{
                                    notifyLevel: (globalNotifyLevelName)
                                }}
                            />
                        </label>
                        <br/>
                    </div>
                    <div className='radio'>
                        <label>
                            <input
                                id='channelNotificationAllActivity'
                                type='radio'
                                name='desktopNotificationLevel'
                                checked={notifyActive[1]}
                                onChange={this.handleUpdateDesktopNotifyLevel.bind(this, NotificationLevels.ALL)}
                            />
                            <FormattedMessage id='channel_notifications.allActivity'/>
                        </label>
                        <br/>
                    </div>
                    <div className='radio'>
                        <label>
                            <input
                                id='channelNotificationMentions'
                                type='radio'
                                name='desktopNotificationLevel'
                                checked={notifyActive[2]}
                                onChange={this.handleUpdateDesktopNotifyLevel.bind(this, NotificationLevels.MENTION)}
                            />
                            <FormattedMessage id='channel_notifications.onlyMentions'/>
                        </label>
                        <br/>
                    </div>
                    <div className='radio'>
                        <label>
                            <input
                                id='channelNotificationNever'
                                type='radio'
                                name='desktopNotificationLevel'
                                checked={notifyActive[3]}
                                onChange={this.handleUpdateDesktopNotifyLevel.bind(this, NotificationLevels.NONE)}
                            />
                            <FormattedMessage id='channel_notifications.never'/>
                        </label>
                    </div>
                </div>
            );

            const handleUpdateSection = function updateSection(e) {
                this.updateSection('');
                this.setState({
                    notifyLevel: this.props.channelMember.notify_props.desktop
                });
                e.preventDefault();
            }.bind(this);

            const extraInfo = (
                <span>
                    <FormattedMessage
                        id='channel_notifications.override'
                        defaultMessage='Selecting an option other than "Default" will override the global notification settings. Desktop notifications are available on Firefox, Safari, and Chrome.'
                    />
                </span>
            );

            return (
                <SettingItemMax
                    title={sendDesktop}
                    inputs={inputs}
                    submit={this.handleSubmitDesktopNotifyLevel}
                    server_error={serverError}
                    updateSection={handleUpdateSection}
                    extraInfo={extraInfo}
                />
            );
        }

        var describe;
        if (notificationLevel === NotificationLevels.DEFAULT) {
            describe = (
                <FormattedMessage
                    id='channel_notifications.globalDefault'
                    values={{
                        notifyLevel: (globalNotifyLevelName)
                    }}
                />
            );
        } else if (notificationLevel === NotificationLevels.MENTION) {
            describe = (<FormattedMessage id='channel_notifications.onlyMentions'/>);
        } else if (notificationLevel === NotificationLevels.ALL) {
            describe = (<FormattedMessage id='channel_notifications.allActivity'/>);
        } else {
            describe = (<FormattedMessage id='channel_notifications.never'/>);
        }

        return (
            <SettingItemMin
                title={sendDesktop}
                describe={describe}
                updateSection={() => {
                    this.updateSection('desktop');
                }}
            />
        );
    }

    handleSubmitMarkUnreadLevel() {
        const channelId = this.props.channel.id;
        const markUnreadLevel = this.state.unreadLevel;

        if (this.props.channelMember.notify_props.mark_unread === markUnreadLevel) {
            this.updateSection('');
            return;
        }

        const options = {mark_unread: markUnreadLevel};
        const data = {
            channel_id: channelId,
            user_id: this.props.currentUser.id
        };

        updateChannelNotifyProps(data, options,
            () => {
                this.updateSection('');
            },
            (err) => {
                this.setState({serverError: err.message});
            }
        );
    }

    handleUpdateMarkUnreadLevel(unreadLevel) {
        this.setState({unreadLevel});
    }

    createMarkUnreadLevelSection(serverError) {
        const muteChannel = this.props.channelMember.notify_props ? this.props.channelMember.notify_props.mute : 'false';
        if (muteChannel === 'true') {
            return null;
        }

        let content;

        const markUnread = (
            <FormattedMessage
                id='channel_notifications.markUnread'
                defaultMessage='Mark Channel Unread'
            />
        );
        if (this.state.activeSection === 'markUnreadLevel') {
            const inputs = [(
                <div key='channel-notification-unread-radio'>
                    <div className='radio'>
                        <label>
                            <input
                                id='channelUnreadAll'
                                type='radio'
                                name='markUnreadLevel'
                                checked={this.state.unreadLevel === NotificationLevels.ALL}
                                onChange={this.handleUpdateMarkUnreadLevel.bind(this, NotificationLevels.ALL)}
                            />
                            <FormattedMessage
                                id='channel_notifications.allUnread'
                                defaultMessage='For all unread messages'
                            />
                        </label>
                        <br/>
                    </div>
                    <div className='radio'>
                        <label>
                            <input
                                id='channelUnreadMentions'
                                type='radio'
                                name='markUnreadLevel'
                                checked={this.state.unreadLevel === NotificationLevels.MENTION}
                                onChange={this.handleUpdateMarkUnreadLevel.bind(this, NotificationLevels.MENTION)}
                            />
                            <FormattedMessage id='channel_notifications.onlyMentions'/>
                        </label>
                        <br/>
                    </div>
                </div>
            )];

            const handleUpdateSection = function handleUpdateSection(e) {
                this.updateSection('');
                this.setState({
                    unreadLevel: this.props.channelMember.notify_props.mark_unread
                });
                e.preventDefault();
            }.bind(this);

            const extraInfo = (
                <span>
                    <FormattedMessage
                        id='channel_notifications.unreadInfo'
                        defaultMessage='The channel name is bolded in the sidebar when there are unread messages. Selecting "Only for mentions" will bold the channel only when you are mentioned.'
                    />
                </span>
            );

            content = (
                <SettingItemMax
                    title={markUnread}
                    inputs={inputs}
                    submit={this.handleSubmitMarkUnreadLevel}
                    server_error={serverError}
                    updateSection={handleUpdateSection}
                    extraInfo={extraInfo}
                />
            );
        } else {
            let describe;

            if (!this.state.unreadLevel || this.state.unreadLevel === NotificationLevels.ALL) {
                describe = (
                    <FormattedMessage
                        id='channel_notifications.allUnread'
                        defaultMessage='For all unread messages'
                    />
                );
            } else {
                describe = (<FormattedMessage id='channel_notifications.onlyMentions'/>);
            }

            const handleUpdateSection = function handleUpdateSection(e) {
                this.updateSection('markUnreadLevel');
                this.setState({
                    unreadLevel: this.props.channelMember.notify_props.mark_unread
                });
                e.preventDefault();
            }.bind(this);

            content = (
                <SettingItemMin
                    title={markUnread}
                    describe={describe}
                    updateSection={handleUpdateSection}
                />
            );
        }

        return content;
    }

    handleSubmitPushNotificationLevel() {
        const channelId = this.props.channel.id;
        const notifyLevel = this.state.pushLevel;
        const currentUserId = this.props.currentUser.id;

        if (this.props.channelMember.notify_props.push === notifyLevel) {
            this.updateSection('');
            return;
        }

        const options = {push: notifyLevel};
        const data = {
            channel_id: channelId,
            user_id: currentUserId
        };

        updateChannelNotifyProps(data, options,
            () => {
                this.updateSection('');
            },
            (err) => {
                this.setState({serverError: err.message});
            }
        );
    }

    handleUpdatePushNotificationLevel(pushLevel) {
        this.setState({pushLevel});
    }

    createPushNotificationLevelSection(serverError) {
        const muteChannel = this.props.channelMember.notify_props ? this.props.channelMember.notify_props.mute : 'false';
        if (muteChannel === 'true') {
            return null;
        }

        if (global.mm_config.SendPushNotifications === 'false') {
            return null;
        }

        // Get glabal user setting for notifications
        const globalNotifyLevel = this.props.currentUser.notify_props ? this.props.currentUser.notify_props.push : NotificationLevels.ALL;
        let globalNotifyLevelName;
        if (globalNotifyLevel === NotificationLevels.ALL) {
            globalNotifyLevelName = (
                <FormattedMessage
                    id='channel_notifications.allActivity'
                    defaultMessage='For all activity'
                />
            );
        } else if (globalNotifyLevel === NotificationLevels.MENTION) {
            globalNotifyLevelName = (
                <FormattedMessage
                    id='channel_notifications.onlyMentions'
                    defaultMessage='Only for mentions'
                />
            );
        } else {
            globalNotifyLevelName = (
                <FormattedMessage
                    id='channel_notifications.never'
                    defaultMessage='Never'
                />
            );
        }

        const sendPushNotifications = (
            <FormattedMessage
                id='channel_notifications.push'
                defaultMessage='Send mobile push notifications'
            />
        );

        const notificationLevel = this.state.pushLevel;

        let content;
        if (this.state.activeSection === 'push') {
            const notifyActive = [false, false, false, false];
            if (notificationLevel === NotificationLevels.DEFAULT) {
                notifyActive[0] = true;
            } else if (notificationLevel === NotificationLevels.ALL) {
                notifyActive[1] = true;
            } else if (notificationLevel === NotificationLevels.MENTION) {
                notifyActive[2] = true;
            } else {
                notifyActive[3] = true;
            }

            const inputs = [];

            inputs.push(
                <div key='channel-notification-level-radio'>
                    <div className='radio'>
                        <label>
                            <input
                                id='channelPushNotificationGlobalDefault'
                                type='radio'
                                name='pushNotificationLevel'
                                checked={notifyActive[0]}
                                onChange={this.handleUpdatePushNotificationLevel.bind(this, NotificationLevels.DEFAULT)}
                            />
                            <FormattedMessage
                                id='channel_notifications.globalDefault'
                                defaultMessage='Global default ({notifyLevel})'
                                values={{
                                    notifyLevel: (globalNotifyLevelName)
                                }}
                            />
                        </label>
                        <br/>
                    </div>
                    <div className='radio'>
                        <label>
                            <input
                                id='channelPushNotificationAllActivity'
                                type='radio'
                                name='pushNotificationLevel'
                                checked={notifyActive[1]}
                                onChange={this.handleUpdatePushNotificationLevel.bind(this, NotificationLevels.ALL)}
                            />
                            <FormattedMessage id='channel_notifications.allActivity'/>
                        </label>
                        <br/>
                    </div>
                    <div className='radio'>
                        <label>
                            <input
                                id='channelPushNotificationMentions'
                                type='radio'
                                name='pushNotificationLevel'
                                checked={notifyActive[2]}
                                onChange={this.handleUpdatePushNotificationLevel.bind(this, NotificationLevels.MENTION)}
                            />
                            <FormattedMessage id='channel_notifications.onlyMentions'/>
                        </label>
                        <br/>
                    </div>
                    <div className='radio'>
                        <label>
                            <input
                                id='channelPushNotificationNever'
                                type='radio'
                                name='pushNotificationLevel'
                                checked={notifyActive[3]}
                                onChange={this.handleUpdatePushNotificationLevel.bind(this, NotificationLevels.NONE)}
                            />
                            <FormattedMessage id='channel_notifications.never'/>
                        </label>
                    </div>
                </div>
            );

            const handleUpdateSection = function updateSection(e) {
                this.updateSection('');
                this.setState({
                    pushLevel: this.props.channelMember.notify_props.push || NotificationLevels.DEFAULT
                });
                e.preventDefault();
            }.bind(this);

            const extraInfo = (
                <span>
                    <FormattedMessage
                        id='channel_notifications.overridePush'
                        defaultMessage='Selecting an option other than "Global default" will override the global notification settings for mobile push notifications in account settings. Push notifications must be enabled by the System Admin.'
                    />
                </span>
            );

            content = (
                <SettingItemMax
                    title={sendPushNotifications}
                    inputs={inputs}
                    submit={this.handleSubmitPushNotificationLevel}
                    server_error={serverError}
                    updateSection={handleUpdateSection}
                    extraInfo={extraInfo}
                />
            );
        } else {
            let describe;
            if (notificationLevel === NotificationLevels.DEFAULT) {
                describe = (
                    <FormattedMessage
                        id='channel_notifications.globalDefault'
                        values={{
                            notifyLevel: (globalNotifyLevelName)
                        }}
                    />
                );
            } else if (notificationLevel === NotificationLevels.MENTION) {
                describe = (<FormattedMessage id='channel_notifications.onlyMentions'/>);
            } else if (notificationLevel === NotificationLevels.ALL) {
                describe = (<FormattedMessage id='channel_notifications.allActivity'/>);
            } else {
                describe = (<FormattedMessage id='channel_notifications.never'/>);
            }

            content = (
                <SettingItemMin
                    title={sendPushNotifications}
                    describe={describe}
                    updateSection={() => {
                        this.updateSection('push');
                    }}
                />
            );
        }

        return (
            <div>
                <div className='divider-light'/>
                {content}
            </div>
        );
    }

    handleSubmitMuteNotificationLevel() {
        const channelId = this.props.channel.id;
        const notifyLevel = this.state.muteLevel;
        const currentUserId = this.props.currentUser.id;

        if (this.props.channelMember.notify_props.mute === notifyLevel) {
            this.updateSection('');
            return;
        }

        const options = {mute: notifyLevel};
        const data = {
            channel_id: channelId,
            user_id: currentUserId
        };

        updateChannelNotifyProps(data, options,
            () => {
                this.updateSection('');
            },
            (err) => {
                this.setState({serverError: err.message});
            }
        );
    }

    handleUpdateMuteNotificationLevel(muteLevel) {
        this.setState({muteLevel});
    }

    createMuteNotificationLevelSection(serverError) {
        const notificationLevel = this.state.muteLevel;

        const muteNotifyName = (
            <FormattedMessage
                id='channel_notifications.muteChannel.settings'
                defaultMessage='Mute Channel'
            />
        );

        if (this.state.activeSection === 'mute') {
            const notifyActive = [false, false];
            if (notificationLevel === 'true') {
                notifyActive[0] = true;
            } else {
                notifyActive[1] = true;
            }

            var inputs = [];

            inputs.push(
                <div key='channel-notification-level-radio'>
                    <div className='radio'>
                        <label>
                            <input
                                id='channelNotificationMute'
                                type='radio'
                                name='muteNotificationLevel'
                                checked={notifyActive[0]}
                                onChange={this.handleUpdateMuteNotificationLevel.bind(this, 'true')}
                            />
                            <FormattedMessage
                                id='channel_notifications.muteChannel.on.title'
                                defaultMessage='On'
                            />
                        </label>
                        <br/>
                    </div>
                    <div className='radio'>
                        <label>
                            <input
                                id='channelNotificationMute'
                                type='radio'
                                name='muteNotificationLevel'
                                checked={notifyActive[1]}
                                onChange={this.handleUpdateMuteNotificationLevel.bind(this, 'false')}
                            />
                            <FormattedMessage
                                id='channel_notifications.muteChannel.off.title'
                                defaultMessage='Off'
                            />
                        </label>
                        <br/>
                    </div>
                </div>
            );

            const handleUpdateSection = function updateSection(e) {
                this.updateSection('');
                this.setState({
                    muteLevel: this.props.channelMember.notify_props.mute || 'false'
                });
                e.preventDefault();
            }.bind(this);

            const extraInfo = (
                <span>
                    <FormattedMessage
                        id='channel_notifications.muteChannel.help'
                        defaultMessage='Muting turns off desktop, email and push notifications for this channel. The channel will not be marked as unread unless you are mentioned.'
                    />
                </span>
            );

            return (
                <SettingItemMax
                    title={muteNotifyName}
                    inputs={inputs}
                    submit={this.handleSubmitMuteNotificationLevel}
                    server_error={serverError}
                    updateSection={handleUpdateSection}
                    extraInfo={extraInfo}
                />
            );
        }

        var describe;
        if (notificationLevel === 'true') {
            describe = (<FormattedMessage id='channel_notifications.muteChannel.on.desc'/>);
        } else {
            describe = (<FormattedMessage id='channel_notifications.muteChannel.off.desc'/>);
        }

        return (
            <SettingItemMin
                title={muteNotifyName}
                describe={describe}
                updateSection={() => {
                    this.updateSection('mute');
                }}
            />
        );
    }

    render() {
        let serverError = null;
        if (this.state.serverError) {
            serverError = <div className='form-group has-error'><label className='control-label'>{this.state.serverError}</label></div>;
        }

        return (
            <Modal
                show={this.state.show}
                dialogClassName='settings-modal settings-modal--tabless'
                onHide={this.onHide}
                onExited={this.props.onHide}
            >
                <Modal.Header closeButton={true}>
                    <Modal.Title>
                        <FormattedMessage
                            id='channel_notifications.preferences'
                            defaultMessage='Notification Preferences for '
                        />
                        <span className='name'>{this.props.channel.display_name}</span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='settings-table'>
                        <div className='settings-content'>
                            <div
                                ref='wrapper'
                                className='user-settings'
                            >
                                <br/>
                                <div className='divider-dark first'/>
                                {this.createMuteNotificationLevelSection(serverError)}
                                <div className='divider-light'/>
                                {this.createDesktopNotifyLevelSection(serverError)}
                                {this.createPushNotificationLevelSection(serverError)}
                                <div className='divider-light'/>
                                {this.createMarkUnreadLevelSection(serverError)}
                                <div className='divider-dark'/>
                            </div>
                        </div>
                    </div>
                    {serverError}
                </Modal.Body>
            </Modal>
        );
    }
}

ChannelNotificationsModal.propTypes = {
    onHide: PropTypes.func.isRequired,
    channel: PropTypes.object.isRequired,
    channelMember: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired
};
