
import { mapGetters, mapActions, mapMutations } from 'vuex';
import { createTranslator } from 'utils/i18n';
import { dialog, alert } from 'edit_channel/utils/dialog';

const channelStrings = createTranslator('ChannelStrings', {
  	unsavedChanges: "Unsaved Changes!",
	unsavedChangesText: "Exiting now will undo any new changes. Are you sure you want to exit?",
	dontSave: "Discard Changes",
	keepOpen: "Keep Editing",
	save: "Save",
	errorChannelSave: "Error Saving Channel"
});

exports.setChannelMixin = {
	computed: Object.assign(
		mapGetters('channel_list', [
			'activeChannel',
			'changed'
		]),
		{
			channelStrings() {
				return channelStrings;
			}
		}
	),
	methods: Object.assign(
		mapActions('channel_list', ['saveChannel']),
		mapMutations('channel_list', {
			setActiveChannel: 'SET_ACTIVE_CHANNEL',
			cancelChanges: 'CANCEL_CHANNEL_CHANGES'
		}),
	    {
			setChannel: function (channel) {
				// Check for changes here when user switches or closes panel
				if(this.changed && (!channel || channel.id !== this.activeChannel.id)) {
					dialog(this.channelStrings("unsavedChanges"), this.channelStrings("unsavedChangesText"), {
						[this.channelStrings("dontSave")]: () => {
							this.cancelChanges();
							this.setActiveChannel(channel);
						},
						[this.channelStrings("keepOpen")]:() => {},
						[this.channelStrings("save")]: () => {
							this.saveChannel().then(() => {
								this.setActiveChannel(channel);
							}).catch( (error) => {
								alert(this.channelStrings('errorChannelSave'), error.responseText || error);
							});

						},
					}, null);
				} else {
					this.setActiveChannel(channel);
				}
			}
	    }
  	)
};

exports.tabMixin = {
	mounted() {
		_.defer(() => {
			this.$refs.firstTab.focus();
		});
	}
};
