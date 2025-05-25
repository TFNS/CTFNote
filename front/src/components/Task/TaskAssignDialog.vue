<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import ctfnote from '../../ctfnote';
import { Task, Ctf, PublicProfile, Role } from '../../ctfnote/models';
import { useDialogPluginComponent } from 'quasar';

export default defineComponent({
  name: 'TaskAssignDialog',
  props: {
    task: { type: Object as () => Task, required: true },
  },
  emits: ['update:modelValue', 'assigned'],
  setup(props, { emit }) {
    const selectedMembers = ref<Array<number>>([]);
    const memberOptions = ref<Array<{ id: number; username: string }>>([]);
    const loadingMembers = ref(false);
    const assigning = ref(false);
    const team = ctfnote.profiles.provideTeam();

    // Helper: get currently assigned member ids
    function getAssignedMemberIds() {
      const workOnTasks =
        (props.task.workOnTasks as Array<{
          profileId: number;
          active: boolean;
        }>) || [];
      return workOnTasks
        .filter((w) => w.active)
        .map((w) => Number(w.profileId));
    }

    // Helper: get all assignable members
    function getAssignableMembers() {
      const { result: ctf } = ctfnote.ctfs.getCtf(() => ({
        id: props.task.ctfId,
      }));
      if (ctf.value == null) {
        return [];
      }

      const allMembers = team.value || [];
      const membersOrHigher = allMembers.filter(
        (m: PublicProfile) =>
          m.role !== Role.UserGuest && m.role !== Role.UserFriend,
      );

      const guests = team.value.filter(
        (p) =>
          p.role == Role.UserGuest ||
          (p.role == Role.UserFriend &&
            ctf.value &&
            ctf.value.endTime &&
            ctf.value.endTime.getTime() > Date.now()),
      );

      const guestsWithAccess = (ctf.value?.invitations || [])
        .map((i) => guests.find((g) => g.id === i.profileId))
        .filter((g): g is PublicProfile => g !== undefined);

      const members = [
        ...membersOrHigher,
        ...guestsWithAccess.map((i) => ({
          id: i.id,
          username: i.username,
          role: i.role,
        })),
        ...getAssignedMemberIds().map((id) => ({
          id,
          username: allMembers.find((m) => m.id === id)?.username || '',
        })),
      ];
      // deduplicate the above array
      return Array.from(new Map(members.map((m) => [m.id, m])).values());
    }

    memberOptions.value = getAssignableMembers().map((m) => ({
      id: Number(m.id),
      username: m.username,
    }));
    selectedMembers.value = getAssignedMemberIds();

    const assignUserToTask = ctfnote.tasks.useAssignUserToTask();
    const unassignUserFromTask = ctfnote.tasks.useUnassignUserFromTask();

    const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent();

    const assignMembers = async () => {
      assigning.value = true;
      try {
        const prevAssigned = getAssignedMemberIds();
        const nextAssigned = selectedMembers.value;
        const toAssign = nextAssigned.filter(
          (id) => !prevAssigned.includes(id),
        );
        const toUnassign = prevAssigned.filter(
          (id) => !nextAssigned.includes(id),
        );
        await Promise.all([
          ...toAssign.map((userId: number) =>
            assignUserToTask(userId, (props.task as { id: number }).id),
          ),
          ...toUnassign.map((userId: number) =>
            unassignUserFromTask(userId, (props.task as { id: number }).id),
          ),
        ]);
        emit('assigned');
        onDialogOK();
      } finally {
        assigning.value = false;
      }
    };

    return {
      dialogRef,
      onDialogHide,
      onDialogOK,
      selectedMembers,
      memberOptions,
      loadingMembers,
      assigning,
      assignMembers,
    };
  },
});
</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card style="min-width: 350px; max-width: 90vw">
      <q-card-section>
        <div class="text-h6">Assign members to {{ this.task.title }}</div>
      </q-card-section>
      <q-card-section>
        <q-select
          v-model="selectedMembers"
          :options="memberOptions"
          option-label="username"
          option-value="id"
          multiple
          label="Select members"
          emit-value
          map-options
          use-chips
          :loading="loadingMembers"
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn v-close-popup flat label="Cancel" />
        <q-btn
          color="primary"
          label="Assign"
          :loading="assigning"
          @click="assignMembers"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
