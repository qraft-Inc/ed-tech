'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Upload, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface CourseFormData {
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  tags: string[];
  prerequisites: string[];
  learningObjectives: string[];
  duration: number;
  language: string;
  thumbnail?: string;
  passThreshold: number;
}

export default function CreateCoursePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [prerequisiteInput, setPrerequisiteInput] = useState('');
  const [objectiveInput, setObjectiveInput] = useState('');
  
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    level: 'beginner',
    category: '',
    tags: [],
    prerequisites: [],
    learningObjectives: [],
    duration: 0,
    language: 'en',
    passThreshold: 70,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' || name === 'passThreshold' ? Number(value) : value,
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag),
    }));
  };

  const addPrerequisite = () => {
    if (prerequisiteInput.trim() && !formData.prerequisites.includes(prerequisiteInput.trim())) {
      setFormData(prev => ({
        ...prev,
        prerequisites: [...prev.prerequisites, prerequisiteInput.trim()],
      }));
      setPrerequisiteInput('');
    }
  };

  const removePrerequisite = (prereq: string) => {
    setFormData(prev => ({
      ...prev,
      prerequisites: prev.prerequisites.filter(p => p !== prereq),
    }));
  };

  const addObjective = () => {
    if (objectiveInput.trim() && !formData.learningObjectives.includes(objectiveInput.trim())) {
      setFormData(prev => ({
        ...prev,
        learningObjectives: [...prev.learningObjectives, objectiveInput.trim()],
      }));
      setObjectiveInput('');
    }
  };

  const removeObjective = (objective: string) => {
    setFormData(prev => ({
      ...prev,
      learningObjectives: prev.learningObjectives.filter(o => o !== objective),
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    try {
      setUploading(true);

      // Get signature from API
      const signatureResponse = await fetch('/api/upload/signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder: 'courses' }),
      });

      if (!signatureResponse.ok) {
        throw new Error('Failed to get upload signature');
      }

      const { signature, timestamp, cloudName, apiKey } = await signatureResponse.json();

      // Upload to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('signature', signature);
      formData.append('timestamp', timestamp.toString());
      formData.append('api_key', apiKey);
      formData.append('folder', 'courses');

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image');
      }

      const uploadData = await uploadResponse.json();
      
      setFormData(prev => ({
        ...prev,
        thumbnail: uploadData.secure_url,
      }));

      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error('Please enter a course title');
      return;
    }

    if (!formData.category.trim()) {
      toast.error('Please enter a course category');
      return;
    }

    if (formData.learningObjectives.length === 0) {
      toast.error('Please add at least one learning objective');
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create course');
      }

      const data = await response.json();
      toast.success('Course created successfully!');
      router.push(`/facilitator/courses/${data.course._id}`);
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create course');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          href="/facilitator/courses"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Courses
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Create New Course</h1>
        <p className="text-gray-600 mt-2">Fill in the details to create a new course</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Course Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="input"
                placeholder="e.g., Introduction to Web Development"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="input"
                placeholder="Describe what students will learn in this course"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="e.g., Technology, Business"
                  required
                />
              </div>

              <div>
                <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
                  Level *
                </label>
                <select
                  id="level"
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  className="input"
                  required
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="e.g., 120"
                  min="0"
                />
              </div>

              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                  Language
                </label>
                <select
                  id="language"
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  className="input"
                >
                  <option value="en">English</option>
                  <option value="sw">Swahili</option>
                  <option value="lg">Luganda</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="passThreshold" className="block text-sm font-medium text-gray-700 mb-1">
                Pass Threshold (%)
              </label>
              <input
                type="number"
                id="passThreshold"
                name="passThreshold"
                value={formData.passThreshold}
                onChange={handleInputChange}
                className="input"
                placeholder="70"
                min="0"
                max="100"
              />
              <p className="text-sm text-gray-500 mt-1">
                Minimum percentage required to pass the course
              </p>
            </div>
          </div>
        </div>

        {/* Course Thumbnail */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Course Thumbnail</h2>
          
          <div className="space-y-4">
            {formData.thumbnail ? (
              <div className="relative w-full h-64 rounded-lg overflow-hidden">
                <Image
                  src={formData.thumbnail}
                  alt="Course thumbnail"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, thumbnail: undefined }))}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <label htmlFor="thumbnail" className="cursor-pointer">
                  <span className="text-primary-600 hover:text-primary-700 font-medium">
                    Upload an image
                  </span>
                  <input
                    type="file"
                    id="thumbnail"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                <p className="text-sm text-gray-500 mt-2">PNG, JPG up to 5MB</p>
                {uploading && <p className="text-primary-600 mt-2">Uploading...</p>}
              </div>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Tags</h2>
          
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="input flex-1"
                placeholder="Add a tag"
              />
              <button
                type="button"
                onClick={addTag}
                className="btn btn-secondary"
              >
                Add
              </button>
            </div>

            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-primary-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Prerequisites */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Prerequisites</h2>
          
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={prerequisiteInput}
                onChange={(e) => setPrerequisiteInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPrerequisite())}
                className="input flex-1"
                placeholder="Add a prerequisite"
              />
              <button
                type="button"
                onClick={addPrerequisite}
                className="btn btn-secondary"
              >
                Add
              </button>
            </div>

            {formData.prerequisites.length > 0 && (
              <ul className="space-y-2">
                {formData.prerequisites.map((prereq, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-gray-700">{prereq}</span>
                    <button
                      type="button"
                      onClick={() => removePrerequisite(prereq)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Learning Objectives */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Learning Objectives *
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={objectiveInput}
                onChange={(e) => setObjectiveInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addObjective())}
                className="input flex-1"
                placeholder="Add a learning objective"
              />
              <button
                type="button"
                onClick={addObjective}
                className="btn btn-secondary"
              >
                Add
              </button>
            </div>

            {formData.learningObjectives.length > 0 ? (
              <ul className="space-y-2">
                {formData.learningObjectives.map((objective, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-gray-700">{objective}</span>
                    <button
                      type="button"
                      onClick={() => removeObjective(objective)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">
                Add at least one learning objective for your course
              </p>
            )}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary flex-1"
          >
            {isSubmitting ? 'Creating...' : 'Create Course'}
          </button>
          <Link href="/facilitator/courses" className="btn btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
