import { getTimeRange } from 'netlify/utils/time-utils';
import { Absence, Lesson, ShortData } from 'webuntis';
import {
    AbsenceReadable,
    LessonReadable,
    SubjectDigest,
    SubjectMap,
} from './entities.model';

export const getSubjectId = (subjects: ShortData[]) => {
    return subjects.map((su) => `${su.longname} (${su.name})`).join(', ');
};

export const digestSubjectMap = (subjectMap: SubjectMap) => {
    const subjectEntries = Object.entries(subjectMap);
    const digestedSubjectEntries = subjectEntries.map<[string, SubjectDigest]>(
        ([subjectId, subject]) => {
            const regularLessons = subject.regularLessonIds.length;
            const lessonsCancelled = subject.regularLessonCancelledIds.length;

            return [
                subjectId,
                {
                    subjectId,
                    lsnumbers: subject.lsnumbers.size,
                    regularLessons,
                    lessonsCancelled,
                    lessonsOccured: regularLessons - lessonsCancelled,
                    extraLessons: subject.irregularLessonIds.length,
                },
            ];
        }
    );
    return digestedSubjectEntries;
};

export const digestAbsence = (absence: Absence): AbsenceReadable => {
    const absenceTimeRange = getTimeRange(absence);
    const {
        id,
        isExcused,
        studentName,

        startDate,
        endDate,
        startTime,
        endTime,

        createDate,
        createdUser,
        lastUpdate,
        updatedUser,
        excuseStatus,
        reason,
        text,
    } = absence;

    return {
        absenceTimeRange,
        untisTimeRange: {
            startDate,
            endDate,
            startTime,
            endTime,
        },
        untisAbsence: {
            id,
            createdAt: new Date(createDate),
            createdBy: createdUser,
            lastUpdatedAt: new Date(lastUpdate),
            lastUpdatedBy: updatedUser,
            studentName,
            isExcused,
            excuseStatus,
            reason,
            text,
        },
    };
};

export const digestLesson = (lesson: Lesson): LessonReadable => ({
    id: lesson.id,
    lessonTimeRange: getTimeRange(lesson),
    untisTimeRange: {
        date: lesson.date,
        startTime: lesson.startTime,
        endTime: lesson.endTime,
    },
    teachers: lesson.te.map((teacher) => teacher.longname).join(', '),
    subject: getSubjectId(lesson.su),
    rooms: lesson.ro
        .map((room) => `${room.name} (${room.longname})`)
        .join(', '),
    code: lesson.code,
    info: lesson.info,
    otherInfo: {
        activityType: lesson.activityType,
        bkRemark: lesson.bkRemark,
        bkText: lesson.bkText,
        lsnumber: lesson.lsnumber,
        lstext: lesson.lstext,
        sg: lesson.sg,
        statflags: lesson.statflags,
        substText: lesson.substText,
    },
});